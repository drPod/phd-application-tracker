"use client";

import { DocumentsPanel } from "@/components/documents/DocumentsPanel";
import { Document } from "@/lib/types";
import { useDocuments, useCreateDocument } from "@/lib/hooks/useDocuments";
import { usePrograms } from "@/lib/hooks/usePrograms";

export default function DocumentsPage() {
  const { data: documents = [], isLoading: documentsLoading, error: documentsError } = useDocuments();
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const createDocument = useCreateDocument();

  const handleDocumentUpload = (
    documentData: Omit<Document, "id" | "lastModified">
  ) => {
    createDocument.mutate({
      document: {
        name: documentData.name,
        type: documentData.type,
        status: documentData.status,
        wordCount: documentData.wordCount,
        fileUrl: documentData.fileUrl,
      },
      assignedProgramIds: documentData.assignedProgramIds,
    });
  };

  const programsForPanel = programs.map((p) => ({
    id: p.id,
    university: p.university,
    department: p.department,
  }));

  if (documentsLoading || programsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading documents...</p>
      </div>
    );
  }

  if (documentsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-destructive">Error loading documents: {documentsError.message}</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <DocumentsPanel
        documents={documents}
        programs={programsForPanel}
        onDocumentUpload={handleDocumentUpload}
      />
    </div>
  );
}
