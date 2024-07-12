import {Answers} from "./Submission";

export interface SubmissionHistory {
    submissionId: number;
    submissionDate: Date;
    byUserNic: number;
    answers: Answers[];
    finalNote: string;
    formVersion: number;
    reviewDate: Date;
    reviewStatus: string;
    doctorNic: number;
}