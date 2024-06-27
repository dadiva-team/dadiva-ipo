export interface ReviewFormOutputModel {
    doctorNic: number;
    status: string;
    finalNote?: string;
    notes: NoteModel[];
}

interface NoteModel {
    questionId: string;
    noteText?: string;
}