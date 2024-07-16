export interface Terms {
  id: number;
  title: string;
  content: string;
  createdBy: number;
  createdAt: Date;
  lastModifiedBy: number;
  lastModifiedAt: number;
  isActive: boolean;
}

export interface TermsChangeLog {
  id: number;
  changesBy: number;
  ChangedAt: Date;
  OldContent: string;
  NewContent: string;
}
