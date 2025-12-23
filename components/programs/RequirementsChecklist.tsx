"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Requirement } from "@/lib/types";
import { Paperclip, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequirementsChecklistProps {
  requirements: Requirement[];
  onRequirementToggle: (requirementId: string, completed: boolean) => void;
  onRequirementUpdate: (requirementId: string, updates: Partial<Requirement>) => void;
  onRequirementCreate: (requirement: Omit<Requirement, "id">) => void;
}

const defaultRequirements = [
  "Statement of Purpose",
  "3 Letters of Recommendation",
  "GRE Scores",
  "Transcripts",
  "Writing Sample",
  "Application Fee",
];

export function RequirementsChecklist({
  requirements,
  onRequirementToggle,
  onRequirementUpdate,
  onRequirementCreate,
}: RequirementsChecklistProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreateRequirement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const programId = formData.get("programId") as string;

    onRequirementCreate({
      programId,
      name,
      completed: false,
    });

    setIsDialogOpen(false);
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Requirements</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Requirement</DialogTitle>
              <DialogDescription>
                Add a custom requirement for this program
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRequirement} className="space-y-4">
              <input
                type="hidden"
                name="programId"
                value={requirements[0]?.programId || ""}
              />
              <div className="space-y-2">
                <Label htmlFor="name">Requirement Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Portfolio"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Requirement
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {requirements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No requirements yet. Add your first requirement above.
          </div>
        ) : (
          requirements.map((requirement) => {
            const isExpanded = expandedItems.has(requirement.id);
            return (
              <div
                key={requirement.id}
                className={cn(
                  "border rounded-lg p-4 transition-colors",
                  requirement.completed
                    ? "bg-muted/50 border-muted"
                    : "bg-card border-border"
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={requirement.completed}
                    onCheckedChange={(checked) =>
                      onRequirementToggle(
                        requirement.id,
                        checked === true
                      )
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`req-${requirement.id}`}
                        className={cn(
                          "text-sm font-medium cursor-pointer",
                          requirement.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {requirement.name}
                      </Label>
                      <div className="flex items-center gap-2">
                        {requirement.documentId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            title="Document attached"
                          >
                            <Paperclip className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleExpanded(requirement.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`notes-${requirement.id}`} className="text-xs">
                            Notes
                          </Label>
                          <Textarea
                            id={`notes-${requirement.id}`}
                            placeholder="Add notes about this requirement..."
                            value={requirement.notes || ""}
                            onChange={(e) =>
                              onRequirementUpdate(requirement.id, {
                                notes: e.target.value,
                              })
                            }
                            className="min-h-[80px] text-sm"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Paperclip className="h-3 w-3 mr-2" />
                          Attach Document
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

