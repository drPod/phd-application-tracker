"use client";

import { useState } from "react";
import { Program, ProgramStatus } from "@/lib/types";
import { ProgramCard } from "./ProgramCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useDeleteProgram } from "@/lib/hooks/usePrograms";

const statusColumns: { status: ProgramStatus; label: string }[] = [
  { status: "researching", label: "Researching" },
  { status: "applying", label: "Applying" },
  { status: "submitted", label: "Submitted" },
  { status: "decision", label: "Decision" },
];

interface ProgramBoardProps {
  programs: Program[];
  onProgramUpdate?: (programId: string, updates: Partial<Program>) => void;
  onProgramCreate?: (program: Omit<Program, "id">) => void;
}

export function ProgramBoard({
  programs,
  onProgramUpdate,
  onProgramCreate,
}: ProgramBoardProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteProgram = useDeleteProgram();

  const handleStatusChange = (programId: string, status: ProgramStatus) => {
    onProgramUpdate?.(programId, { status });
  };

  const handleDelete = (programId: string) => {
    deleteProgram.mutate(programId);
  };

  const handleCreateProgram = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const university = formData.get("university") as string;
    const department = formData.get("department") as string;
    const deadline = new Date(formData.get("deadline") as string);

    onProgramCreate?.({
      university,
      department,
      deadline,
      status: "researching",
      requirementsCompleted: 0,
      requirementsTotal: 7,
    });

    setIsDialogOpen(false);
    e.currentTarget.reset();
  };

  const programsByStatus = statusColumns.map((column) => ({
    ...column,
    programs: programs.filter((p) => p.status === column.status),
  }));

  const totalPrograms = programs.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Programs</h1>
          <p className="text-muted-foreground mt-2">
            {totalPrograms} {totalPrograms === 1 ? "program" : "programs"} total
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Program</DialogTitle>
              <DialogDescription>
                Enter the details for your new program application
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  name="university"
                  placeholder="MIT"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Computer Science"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Program
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {totalPrograms === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No programs yet"
          description="Get started by adding your first PhD program application"
          action={{
            label: "Add Program",
            onClick: () => setIsDialogOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
          {programsByStatus.map((column) => (
            <div key={column.status} className="flex flex-col min-w-[280px]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {column.label}
                </h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {column.programs.length}
                </span>
              </div>
              <div className="space-y-3 flex-1">
                {column.programs.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
                {column.programs.length === 0 && (
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-sm text-muted-foreground">
                    No programs
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

