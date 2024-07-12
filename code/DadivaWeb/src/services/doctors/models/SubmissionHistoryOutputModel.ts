import {Note} from "../../../domain/Submission/Submission";

export interface SubmissionHistoryModel {
    submissionId: number;
    submissionDate: Date;
    byUserNic: number;
    answers: { questionId: string; answer: string }[];
    finalNote: string;
    formVersion: number;
    notes: Note[];
    reviewDate: Date;
    reviewStatus: string;
    doctorNic: number;
}

export interface SubmissionHistoryOutputModel {
    submissionHistory: SubmissionHistoryModel[];
    hasMoreSubmissions: boolean;
}