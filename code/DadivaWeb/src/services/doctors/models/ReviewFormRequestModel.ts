export interface ReviewFormRequestModel {
    doctorNic: number;
    status: string;
    finalNote?: string;
    notes: NoteModel[];
}

interface NoteModel {
    questionId: string;
    noteText?: string;
}