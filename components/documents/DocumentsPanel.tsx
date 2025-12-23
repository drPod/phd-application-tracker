"use client";

import { useState } from "react";
import { Document, DocumentType, DocumentStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadDialog } from "./UploadDialog";
import { Plus, FileText, File, FileCheck, FileX, Download, ExternalLink, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { downloadFile, deleteFile } from "@/lib/supabase/storage";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: "sop", label: "Statement of Purpose" },
  { value: "ps", label: "Personal Statement" },
  { value: "cv", label: "CV/Resume" },
  { value: "writing-sample", label: "Writing Sample" },
  { value: "custom", label: "Custom" },
];

interface DocumentsPanelProps {
  documents: Document[];
  programs: Array<{ id: string; university: string; department: string }>;
  onDocumentUpload: (document: Omit<Document, "id" | "lastModified">, file?: File) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentUpdate?: (id: string, document: Omit<Document, "id" | "lastModified">, file?: File) => void;
}

export function DocumentsPanel({
  documents,
  programs,
  onDocumentUpload,
  onDocumentDelete,
  onDocumentUpdate,
}: DocumentsPanelProps) {
  const [selectedType, setSelectedType] = useState<DocumentType>("sop");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);

  const filteredDocuments = documents.filter((doc) => doc.type === selectedType);

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "final":
        return <FileCheck className="h-4 w-4 text-success" />;
      case "draft":
        return <FileX className="h-4 w-4 text-warning" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "final":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
            Final
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
            Draft
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getProgramNames = (programIds: string[]) => {
    if (programIds.length === 0) return "No programs";
    const names = programIds
      .map((id) => {
        const program = programs.find((p) => p.id === id);
        return program ? program.university : null;
      })
      .filter(Boolean);
    return names.length > 0 ? names.join(", ") : "No programs";
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.fileUrl) {
      toast.error("No file available for download");
      return;
    }

    try {
      const blob = await downloadFile(doc.fileUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.name}.${doc.fileUrl.split('.').pop()?.split('?')[0] || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("File downloaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download file");
    }
  };

  const handleView = (doc: Document) => {
    if (!doc.fileUrl) {
      toast.error("No file available to view");
      return;
    }
    window.open(doc.fileUrl, "_blank");
  };

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete || !onDocumentDelete) return;

    try {
      // Delete file from storage if it exists
      if (documentToDelete.fileUrl) {
        try {
          await deleteFile(documentToDelete.fileUrl);
        } catch (error) {
          // Continue with database deletion even if file deletion fails
          console.error("Failed to delete file from storage:", error);
        }
      }
      onDocumentDelete(documentToDelete.id);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete document");
    }
  };

  const handleEditClick = (doc: Document) => {
    setDocumentToEdit(doc);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (document: Omit<Document, "id" | "lastModified">, file?: File) => {
    if (documentToEdit && onDocumentUpdate) {
      onDocumentUpdate(documentToEdit.id, document, file);
      setIsEditDialogOpen(false);
      setDocumentToEdit(null);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Panel - Document Types */}
      <div className="w-64 border-r border-border bg-muted/30 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Document Types
        </h2>
        <div className="space-y-1">
          {documentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedType === type.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Documents Table */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-muted-foreground mt-1">
              {filteredDocuments.length}{" "}
              {filteredDocuments.length === 1 ? "document" : "documents"} of type{" "}
              {documentTypes.find((t) => t.value === selectedType)?.label}
            </p>
          </div>
          <UploadDialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
            documentType={selectedType}
            programs={programs}
            onUpload={onDocumentUpload}
          >
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </UploadDialog>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your first {documentTypes.find((t) => t.value === selectedType)?.label.toLowerCase()}
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        ) : (
          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Programs</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Word Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getProgramNames(doc.assignedProgramIds)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(doc.lastModified, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {doc.wordCount ? `${doc.wordCount.toLocaleString()} words` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onDocumentUpdate && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(doc);
                            }}
                            title="Edit document"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {doc.fileUrl && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(doc);
                              }}
                              title="View file"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(doc);
                              }}
                              title="Download file"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {onDocumentDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(doc);
                            }}
                            title="Delete document"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <UploadDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        documentType={documentToEdit?.type || selectedType}
        programs={programs}
        onUpload={handleEditSubmit}
        document={documentToEdit || undefined}
        mode="edit"
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentToDelete?.name}"? 
              This action cannot be undone and will also remove the file from storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDocumentToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

