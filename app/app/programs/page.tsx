"use client";

import { ProgramBoard } from "@/components/programs/ProgramBoard";
import { Program } from "@/lib/types";
import {
  usePrograms,
  useUpdateProgram,
  useCreateProgram,
} from "@/lib/hooks/usePrograms";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";

export default function ProgramsPage() {
  const { data: programs = [], isLoading, error, refetch } = usePrograms();
  const updateProgram = useUpdateProgram();
  const createProgram = useCreateProgram();

  const handleProgramUpdate = (programId: string, updates: Partial<Program>) => {
    updateProgram.mutate({ id: programId, updates });
  };

  const handleProgramCreate = (programData: Omit<Program, "id">) => {
    createProgram.mutate(programData);
  };

  if (isLoading) {
    return <LoadingState message="Loading programs..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || "Failed to load programs. Please try again."}
        onRetry={() => refetch()}
        title="Error Loading Programs"
      />
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
