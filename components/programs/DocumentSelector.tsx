"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/lib/types";
import { FileText } from "lucide-react";
import { useState } from "react";

interface DocumentSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documents: Document[];
  onSelect: (documentId: string) => void;
  currentDocumentId?: string;
}

export function DocumentSelector({
  open,
  onOpenChange,
  documents,
  onSelect,
  currentDocumentId,
}: DocumentSelectorProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    currentDocumentId || null
  );

  const handleSelect = () => {
    if (selectedDocumentId) {
      onSelect(selectedDocumentId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach Document</DialogTitle>
          <DialogDescription>
            Select a document to attach to this requirement
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto space-y-2 py-4">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No documents available. Upload documents first.
            </div>
          ) : (
            documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocumentId(doc.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedDocumentId === doc.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {doc.type} • {doc.status}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedDocumentId}>
            Attach
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

