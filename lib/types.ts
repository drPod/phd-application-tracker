export type ProgramStatus = "researching" | "applying" | "submitted" | "decision";

export interface Program {
  id: string;
  university: string;
  department: string;
  deadline: Date;
  status: ProgramStatus;
  requirementsCompleted: number;
  requirementsTotal: number;
  fee?: number;
}

export interface Requirement {
  id: string;
  programId: string;
  name: string;
  completed: boolean;
  notes?: string;
  documentId?: string;
}

export type DocumentType = "sop" | "ps" | "cv" | "writing-sample" | "custom";

export type DocumentStatus = "draft" | "final";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  assignedProgramIds: string[];
  lastModified: Date;
  wordCount?: number;
  fileUrl?: string;
}
