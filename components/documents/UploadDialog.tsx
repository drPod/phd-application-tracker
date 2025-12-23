"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Document, DocumentType, DocumentStatus } from "@/lib/types";
import { Upload } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: DocumentType;
  programs: Array<{ id: string; university: string; department: string }>;
  onUpload: (document: Omit<Document, "id" | "lastModified">) => void;
  children?: React.ReactNode;
}

export function UploadDialog({
  open,
  onOpenChange,
  documentType,
  programs,
  onUpload,
  children,
}: UploadDialogProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<DocumentStatus>("draft");
  const [selectedProgramIds, setSelectedProgramIds] = useState<Set<string>>(
    new Set()
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleProgramToggle = (programId: string) => {
    setSelectedProgramIds((prev) => {
      const next = new Set(prev);
      if (next.has(programId)) {
        next.delete(programId);
      } else {
        next.add(programId);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !file) return;

    onUpload({
      name,
      type: documentType,
      status,
      assignedProgramIds: Array.from(selectedProgramIds),
      wordCount: undefined, // Could extract from file if needed
      fileUrl: undefined, // Would be set after upload to storage
    });

    // Reset form
    setName("");
    setStatus("draft");
    setSelectedProgramIds(new Set());
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document and assign it to programs
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
              {file && (
                <span className="text-sm text-muted-foreground">
                  {file.name}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., SOP_AI_Safety"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as DocumentStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Assign to Programs</Label>
            <div className="border border-border rounded-lg p-4 max-h-60 overflow-y-auto">
              {programs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No programs available. Add programs first.
                </p>
              ) : (
                <div className="space-y-2">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`program-${program.id}`}
                        checked={selectedProgramIds.has(program.id)}
                        onCheckedChange={() =>
                          handleProgramToggle(program.id)
                        }
                      />
                      <label
                        htmlFor={`program-${program.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {program.university} - {program.department}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !file}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

