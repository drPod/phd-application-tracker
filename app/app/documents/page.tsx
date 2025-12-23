"use client";

import { DocumentsPanel } from "@/components/documents/DocumentsPanel";
import { Document } from "@/lib/types";
import { useDocuments, useCreateDocument, useDeleteDocument, useUpdateDocument } from "@/lib/hooks/useDocuments";
import { usePrograms } from "@/lib/hooks/usePrograms";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";

export default function DocumentsPage() {
  const { data: documents = [], isLoading: documentsLoading, error: documentsError, refetch: refetchDocuments } = useDocuments();
  const { data: programs = [], isLoading: programsLoading, refetch: refetchPrograms } = usePrograms();
  const createDocument = useCreateDocument();
  const deleteDocument = useDeleteDocument();
  const updateDocument = useUpdateDocument();

  const handleDocumentUpload = (
    documentData: Omit<Document, "id" | "lastModified">,
    file?: File
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
      file,
    });
  };

  const handleDocumentUpdate = (
    id: string,
    documentData: Omit<Document, "id" | "lastModified">,
    file?: File
  ) => {
    // Find the current document to get the old file URL
    const currentDoc = documents.find((d) => d.id === id);
    
    updateDocument.mutate({
      id,
      updates: {
        name: documentData.name,
        type: documentData.type,
        status: documentData.status,
        wordCount: documentData.wordCount,
        fileUrl: documentData.fileUrl,
      },
      assignedProgramIds: documentData.assignedProgramIds,
      file,
      oldFileUrl: currentDoc?.fileUrl,
    });
  };

  const programsForPanel = programs.map((p) => ({
    id: p.id,
    university: p.university,
    department: p.department,
  }));

  if (documentsLoading || programsLoading) {
    return <LoadingState message="Loading documents..." />;
  }

  if (documentsError) {
    return (
      <ErrorState
        message={documentsError.message || "Failed to load documents. Please try again."}
        onRetry={() => {
          refetchDocuments();
          refetchPrograms();
        }}
        title="Error Loading Documents"
      />
    );
  }

  return (
    <div className="h-screen">
      <DocumentsPanel
        documents={documents}
        programs={programsForPanel}
        onDocumentUpload={handleDocumentUpload}
        onDocumentDelete={(id) => deleteDocument.mutate(id)}
        onDocumentUpdate={handleDocumentUpdate}
      />
    </div>
  );
}
