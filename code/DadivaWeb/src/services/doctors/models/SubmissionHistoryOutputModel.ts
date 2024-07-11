export interface SubmissionHistoryModel {
    submissionId: number;
    submissionDate: Date;
    byUserNic: number;
    answers: { questionId: string; answer: string }[];
    formVersion: number;
    reviewDate: Date;
    reviewStatus: string;
    doctorNic: number;
}

export interface SubmissionHistoryOutputModel {
    submissionHistory: SubmissionHistoryModel[];
    hasMoreSubmissions: boolean;
}