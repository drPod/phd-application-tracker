"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical, Plus, Paperclip, Trash2 } from "lucide-react";
import { DeadlineChip } from "./DeadlineChip";
import { Program, ProgramStatus } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface ProgramCardProps {
  program: Program;
  onStatusChange?: (programId: string, status: ProgramStatus) => void;
  onDelete?: (programId: string) => void;
}

const statusOptions: { value: ProgramStatus; label: string }[] = [
  { value: "researching", label: "Researching" },
  { value: "applying", label: "Applying" },
  { value: "submitted", label: "Submitted" },
  { value: "decision", label: "Decision" },
];

export function ProgramCard({ program, onStatusChange, onDelete }: ProgramCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const progressPercentage =
    program.requirementsTotal > 0
      ? (program.requirementsCompleted / program.requirementsTotal) * 100
      : 0;

  const handleDelete = () => {
    onDelete?.(program.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <Link
                href={`/app/programs/${program.id}`}
                className="block group"
              >
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                  {program.university}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {program.department}
                </p>
              </Link>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onStatusChange?.(program.id, option.value)}
                    className={program.status === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        <div className="mb-3">
          <DeadlineChip deadline={program.deadline} />
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Requirements</span>
            <span className="font-medium">
              {program.requirementsCompleted}/{program.requirementsTotal}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
        </div>

        {program.fee && (
          <div className="mb-3 text-sm text-muted-foreground">
            Fee: ${program.fee}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Requirement
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Paperclip className="h-3 w-3 mr-1" />
            Document
          </Button>
        </div>
      </CardContent>
    </Card>

    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Program</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {program.university} - {program.department}? 
            This action cannot be undone and will also delete all associated requirements.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

