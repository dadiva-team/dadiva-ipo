export interface ReviewFormRequestModel {
  doctorNic: number;
  status: boolean;
  finalNote?: string;
  notes: NoteModel[];
}

interface NoteModel {
  questionId: string;
  noteText?: string;
}
