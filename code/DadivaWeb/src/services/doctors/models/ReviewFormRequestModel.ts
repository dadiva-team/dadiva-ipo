export interface ReviewFormRequestModel {
  status: boolean;
  finalNote?: string;
  notes: NoteModel[];
  suspend: boolean;
}

interface NoteModel {
  questionId: string;
  noteText?: string;
}
