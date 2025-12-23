"use client";

import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RequirementsChecklist } from "@/components/programs/RequirementsChecklist";
import { DeadlineChip } from "@/components/programs/DeadlineChip";
import { ProgramStatus } from "@/lib/types";
import { differenceInDays } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePrograms, useUpdateProgram } from "@/lib/hooks/usePrograms";
import {
  useRequirements,
  useUpdateRequirement,
  useCreateRequirement,
  useDeleteRequirement,
} from "@/lib/hooks/useRequirements";
import { useMemo } from "react";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const programId = resolvedParams.programId;

  const { data: programs = [], isLoading: programsLoading, error: programsError, refetch: refetchPrograms } = usePrograms();
  const { data: requirements = [], isLoading: requirementsLoading, error: requirementsError, refetch: refetchRequirements } = useRequirements(programId);
  const updateProgram = useUpdateProgram();
  const updateRequirement = useUpdateRequirement();
  const createRequirement = useCreateRequirement();
  const deleteRequirement = useDeleteRequirement();

  const program = useMemo(() => {
    return programs.find((p) => p.id === programId);
  }, [programs, programId]);

  const isLoading = programsLoading || requirementsLoading;
  const error = programsError || requirementsError;

  if (isLoading) {
    return <LoadingState message="Loading program..." />;
  }

  if (error) {
    return (
      <div className="p-8">
        <Link href="/app/programs">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>
        </Link>
        <ErrorState
          message={error.message || "Failed to load program. Please try again."}
          onRetry={() => {
            refetchPrograms();
            refetchRequirements();
          }}
          title="Error Loading Program"
        />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-8">
        <Link href="/app/programs">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>
        </Link>
        <ErrorState
          message="The program you're looking for doesn't exist or has been deleted."
          title="Program Not Found"
        />
      </div>
    );
  }

  const daysUntil = differenceInDays(program.deadline, new Date());

  const handleStatusChange = (status: ProgramStatus) => {
    updateProgram.mutate({ id: programId, updates: { status } });
  };

  const handleRequirementToggle = (requirementId: string, completed: boolean) => {
    updateRequirement.mutate({ id: requirementId, updates: { completed } });
  };

  const handleRequirementUpdate = (
    requirementId: string,
    updates: Partial<{ name: string; notes: string; documentId: string }>
  ) => {
    updateRequirement.mutate({ id: requirementId, updates });
  };

  const handleRequirementCreate = (requirement: { programId: string; name: string; completed?: boolean }) => {
    createRequirement.mutate({
      programId: requirement.programId,
      name: requirement.name,
      completed: requirement.completed ?? false,
    });
  };

  const handleRequirementDelete = (requirementId: string) => {
    deleteRequirement.mutate(requirementId);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/app/programs">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{program.university}</h1>
            <p className="text-muted-foreground mt-1">{program.department}</p>
          </div>
          <div className="flex items-center gap-3">
            <DeadlineChip deadline={program.deadline} />
            <Select
              value={program.status}
              onValueChange={(value) => handleStatusChange(value as ProgramStatus)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="researching">Researching</SelectItem>
                <SelectItem value="applying">Applying</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {daysUntil >= 0
              ? `${daysUntil} days until deadline`
              : `${Math.abs(daysUntil)} days overdue`}
          </span>
          <span>•</span>
          <span>
            {program.requirementsCompleted}/{program.requirementsTotal} requirements complete
          </span>
          {program.fee && (
            <>
              <span>•</span>
              <span>Fee: ${program.fee}</span>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="requirements" className="w-full">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="requirements" className="mt-6">
          <RequirementsChecklist
            requirements={requirements}
            onRequirementToggle={handleRequirementToggle}
            onRequirementUpdate={handleRequirementUpdate}
            onRequirementCreate={handleRequirementCreate}
            onRequirementDelete={handleRequirementDelete}
          />
        </TabsContent>
        <TabsContent value="notes" className="mt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Program Notes</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add any notes, reminders, or thoughts about this program
              </p>
            </div>
            <Textarea
              value={program.notes || ""}
              onChange={(e) => {
                updateProgram.mutate({ id: programId, updates: { notes: e.target.value } });
              }}
              placeholder="Add your notes here..."
              className="min-h-[400px]"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
