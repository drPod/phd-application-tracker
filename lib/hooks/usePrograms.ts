"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Program, ProgramStatus } from "@/lib/types";
import { toast } from "sonner";

interface ProgramRow {
  id: string;
  user_id: string;
  university: string;
  department: string;
  deadline: string;
  status: ProgramStatus;
  requirements_completed: number;
  requirements_total: number;
  fee: number | null;
  created_at: string;
  updated_at: string;
}

function transformProgram(row: ProgramRow): Program {
  return {
    id: row.id,
    university: row.university,
    department: row.department,
    deadline: new Date(row.deadline),
    status: row.status,
    requirementsCompleted: row.requirements_completed,
    requirementsTotal: row.requirements_total,
    fee: row.fee ?? undefined,
  };
}

export function usePrograms() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("user_id", user.id)
        .order("deadline", { ascending: true });

      if (error) throw error;
      return (data as ProgramRow[]).map(transformProgram);
    },
  });
}

export function useCreateProgram() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (program: Omit<Program, "id">) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("programs")
        .insert({
          user_id: user.id,
          university: program.university,
          department: program.department,
          deadline: program.deadline.toISOString(),
          status: program.status,
          requirements_completed: program.requirementsCompleted,
          requirements_total: program.requirementsTotal,
          fee: program.fee ?? null,
        })
        .select()
        .single();

      if (error) throw error;
      return transformProgram(data as ProgramRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create program");
    },
  });
}

export function useUpdateProgram() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Program>;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updateData: any = {};
      if (updates.university !== undefined) updateData.university = updates.university;
      if (updates.department !== undefined) updateData.department = updates.department;
      if (updates.deadline !== undefined)
        updateData.deadline = updates.deadline.toISOString();
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.requirementsCompleted !== undefined)
        updateData.requirements_completed = updates.requirementsCompleted;
      if (updates.requirementsTotal !== undefined)
        updateData.requirements_total = updates.requirementsTotal;
      if (updates.fee !== undefined) updateData.fee = updates.fee ?? null;

      const { data, error } = await supabase
        .from("programs")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return transformProgram(data as ProgramRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update program");
    },
  });
}

export function useDeleteProgram() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("programs")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete program");
    },
  });
}
