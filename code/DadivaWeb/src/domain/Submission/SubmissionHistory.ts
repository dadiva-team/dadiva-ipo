import {Answers} from "./Submission";

export interface SubmissionHistory {
    submissionId: number;
    submissionDate: Date;
    byUserNic: number;
    answers: Answers[];
    formVersion: number;
    reviewDate: Date;
    reviewStatus: string;
    doctorNic: number;
}