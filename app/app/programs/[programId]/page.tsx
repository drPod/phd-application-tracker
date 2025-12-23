"use client";

import { useState } from "react";
import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Program, ProgramStatus, Requirement } from "@/lib/types";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock data - in real app, fetch from API
const mockProgram: Program = {
  id: "1",
  university: "MIT",
  department: "Computer Science",
  deadline: new Date("2024-12-15"),
  status: "applying",
  requirementsCompleted: 4,
  requirementsTotal: 7,
  fee: 95,
};

const mockRequirements: Requirement[] = [
  {
    id: "1",
    programId: "1",
    name: "Statement of Purpose",
    completed: true,
    notes: "Focus on AI safety research",
  },
  {
    id: "2",
    programId: "1",
    name: "3 Letters of Recommendation",
    completed: true,
    notes: "Prof. Smith, Prof. Jones, Prof. Lee",
  },
  {
    id: "3",
    programId: "1",
    name: "GRE Scores",
    completed: true,
  },
  {
    id: "4",
    programId: "1",
    name: "Transcripts",
    completed: true,
  },
  {
    id: "5",
    programId: "1",
    name: "Writing Sample",
    completed: false,
    notes: "Need to finalize research paper",
  },
  {
    id: "6",
    programId: "1",
    name: "Application Fee",
    completed: false,
  },
  {
    id: "7",
    programId: "1",
    name: "CV/Resume",
    completed: false,
  },
];

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const resolvedParams = use(params);
  const [program, setProgram] = useState<Program>(mockProgram);
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [notes, setNotes] = useState("");

  const daysUntil = differenceInDays(program.deadline, new Date());

  const handleStatusChange = (status: ProgramStatus) => {
    setProgram((prev) => ({ ...prev, status }));
  };

  const handleRequirementToggle = (requirementId: string, completed: boolean) => {
    setRequirements((prev) =>
      prev.map((req) =>
        req.id === requirementId ? { ...req, completed } : req
      )
    );
    // Update program completion count
    const updated = requirements.map((req) =>
      req.id === requirementId ? { ...req, completed } : req
    );
    const completedCount = updated.filter((r) => r.completed).length;
    setProgram((prev) => ({
      ...prev,
      requirementsCompleted: completedCount,
      requirementsTotal: updated.length,
    }));
  };

  const handleRequirementUpdate = (
    requirementId: string,
    updates: Partial<Requirement>
  ) => {
    setRequirements((prev) =>
      prev.map((req) =>
        req.id === requirementId ? { ...req, ...updates } : req
      )
    );
  };

  const handleRequirementCreate = (requirement: Omit<Requirement, "id">) => {
    const newRequirement: Requirement = {
      ...requirement,
      id: Date.now().toString(),
    };
    setRequirements((prev) => [...prev, newRequirement]);
    setProgram((prev) => ({
      ...prev,
      requirementsTotal: prev.requirementsTotal + 1,
    }));
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
              className="min-h-[400px]"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
