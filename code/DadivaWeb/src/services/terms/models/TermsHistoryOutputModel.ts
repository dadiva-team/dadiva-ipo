export interface TermsHistoryOutputModel {
  history: TermsHistoryItem[];
}

export interface TermsHistoryItem {
  content: string;
  date: string;
  reason: string | null;
  authorName: string;
  authorNic: string;
}
