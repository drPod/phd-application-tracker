"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Requirement } from "@/lib/types";
import { toast } from "sonner";

interface RequirementRow {
  id: string;
  program_id: string;
  name: string;
  completed: boolean;
  notes: string | null;
  document_id: string | null;
  created_at: string;
  updated_at: string;
}

function transformRequirement(row: RequirementRow): Requirement {
  return {
    id: row.id,
    programId: row.program_id,
    name: row.name,
    completed: row.completed,
    notes: row.notes ?? undefined,
    documentId: row.document_id ?? undefined,
  };
}

export function useRequirements(programId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["requirements", programId],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("requirements")
        .select("*")
        .eq("program_id", programId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data as RequirementRow[]).map(transformRequirement);
    },
    enabled: !!programId,
  });
}

export function useCreateRequirement() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requirement: Omit<Requirement, "id">) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("requirements")
        .insert({
          program_id: requirement.programId,
          name: requirement.name,
          completed: requirement.completed,
          notes: requirement.notes ?? null,
          document_id: requirement.documentId ?? null,
        })
        .select()
        .single();

      if (error) throw error;
      return transformRequirement(data as RequirementRow);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requirements", variables.programId] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Requirement created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create requirement");
    },
  });
}

export function useUpdateRequirement() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Requirement>;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.notes !== undefined) updateData.notes = updates.notes ?? null;
      if (updates.documentId !== undefined)
        updateData.document_id = updates.documentId ?? null;

      const { data, error } = await supabase
        .from("requirements")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      const requirement = transformRequirement(data as RequirementRow);
      
      // Update program requirements count
      const { data: programData } = await supabase
        .from("requirements")
        .select("completed")
        .eq("program_id", requirement.programId);
      
      if (programData) {
        const completed = programData.filter((r) => r.completed).length;
        const total = programData.length;
        await supabase
          .from("programs")
          .update({
            requirements_completed: completed,
            requirements_total: total,
          })
          .eq("id", requirement.programId);
      }

      return requirement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requirements", data.programId] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Requirement updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update requirement");
    },
  });
}

export function useDeleteRequirement() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get requirement to know which program to update
      const { data: requirement } = await supabase
        .from("requirements")
        .select("program_id")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("requirements").delete().eq("id", id);

      if (error) throw error;

      // Update program requirements count
      if (requirement) {
        const { data: programData } = await supabase
          .from("requirements")
          .select("completed")
          .eq("program_id", requirement.program_id);

        if (programData) {
          const completed = programData.filter((r) => r.completed).length;
          const total = programData.length;
          await supabase
            .from("programs")
            .update({
              requirements_completed: completed,
              requirements_total: total,
            })
            .eq("id", requirement.program_id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requirements"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Requirement deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete requirement");
    },
  });
}
