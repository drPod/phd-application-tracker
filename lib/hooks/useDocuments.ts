"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Document, DocumentType, DocumentStatus } from "@/lib/types";
import { toast } from "sonner";

interface DocumentRow {
  id: string;
  user_id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  last_modified: string;
  word_count: number | null;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

interface DocumentProgramRow {
  document_id: string;
  program_id: string;
}

async function transformDocument(
  row: DocumentRow,
  supabase: ReturnType<typeof createClient>
): Promise<Document> {
  // Get assigned program IDs
  const { data: documentPrograms } = await supabase
    .from("document_programs")
    .select("program_id")
    .eq("document_id", row.id);

  return {
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    assignedProgramIds:
      documentPrograms?.map((dp) => dp.program_id) || [],
    lastModified: new Date(row.last_modified),
    wordCount: row.word_count ?? undefined,
    fileUrl: row.file_url ?? undefined,
  };
}

export function useDocuments() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("last_modified", { ascending: false });

      if (error) throw error;
      return Promise.all(
        (data as DocumentRow[]).map((row) => transformDocument(row, supabase))
      );
    },
  });
}

export function useCreateDocument() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      document,
      assignedProgramIds,
    }: {
      document: Omit<Document, "id" | "lastModified" | "assignedProgramIds">;
      assignedProgramIds: string[];
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create document
      const { data: docData, error: docError } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          name: document.name,
          type: document.type,
          status: document.status,
          last_modified: new Date().toISOString(),
          word_count: document.wordCount ?? null,
          file_url: document.fileUrl ?? null,
        })
        .select()
        .single();

      if (docError) throw docError;

      // Create document_programs relationships
      if (assignedProgramIds.length > 0) {
        const { error: relError } = await supabase
          .from("document_programs")
          .insert(
            assignedProgramIds.map((programId) => ({
              document_id: docData.id,
              program_id: programId,
            }))
          );

        if (relError) throw relError;
      }

      return transformDocument(docData as DocumentRow, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create document");
    },
  });
}

export function useUpdateDocument() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
      assignedProgramIds,
    }: {
      id: string;
      updates: Partial<Document>;
      assignedProgramIds?: string[];
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.lastModified !== undefined)
        updateData.last_modified = updates.lastModified.toISOString();
      if (updates.wordCount !== undefined)
        updateData.word_count = updates.wordCount ?? null;
      if (updates.fileUrl !== undefined) updateData.file_url = updates.fileUrl ?? null;

      const { data, error } = await supabase
        .from("documents")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      // Update document_programs relationships if provided
      if (assignedProgramIds !== undefined) {
        // Delete existing relationships
        await supabase.from("document_programs").delete().eq("document_id", id);

        // Create new relationships
        if (assignedProgramIds.length > 0) {
          const { error: relError } = await supabase
            .from("document_programs")
            .insert(
              assignedProgramIds.map((programId) => ({
                document_id: id,
                program_id: programId,
              }))
            );

          if (relError) throw relError;
        }
      }

      return transformDocument(data as DocumentRow, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update document");
    },
  });
}

export function useDeleteDocument() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete document");
    },
  });
}
