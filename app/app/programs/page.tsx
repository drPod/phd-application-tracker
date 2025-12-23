"use client";

import { ProgramBoard } from "@/components/programs/ProgramBoard";
import { Program } from "@/lib/types";
import {
  usePrograms,
  useUpdateProgram,
  useCreateProgram,
} from "@/lib/hooks/usePrograms";

export default function ProgramsPage() {
  const { data: programs = [], isLoading, error } = usePrograms();
  const updateProgram = useUpdateProgram();
  const createProgram = useCreateProgram();

  const handleProgramUpdate = (programId: string, updates: Partial<Program>) => {
    updateProgram.mutate({ id: programId, updates });
  };

  const handleProgramCreate = (programData: Omit<Program, "id">) => {
    createProgram.mutate(programData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading programs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Error loading programs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <ProgramBoard
        programs={programs}
        onProgramUpdate={handleProgramUpdate}
        onProgramCreate={handleProgramCreate}
      />
    </div>
  );
}
