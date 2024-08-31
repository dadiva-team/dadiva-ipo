import { DonorModel, SubmissionModel } from './SubmissionOutputModel';

export interface ReviewHistoryModel {
  id: number;
  submission: SubmissionModel;
  doctor: DonorModel;
  status: ReviewStatus;
  finalNote?: string;
  reviewDate: string;
}

export interface SubmissionHistoryOutputModel {
  submissionHistory: ReviewHistoryModel[];
  hasMoreSubmissions: boolean;
}

export enum ReviewStatus {
  Approved = 0,
  Rejected = 1,
}
