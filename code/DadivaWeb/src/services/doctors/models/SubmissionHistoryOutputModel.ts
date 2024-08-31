import { DonorModel, Status, SubmissionAnsweredQuestionModel } from './SubmissionOutputModel';

export interface SubmissionHistoryModel {
  id: number;
  submissionDate: string;
  status: Status;
  answeredQuestions: SubmissionAnsweredQuestionModel[];
  finalNote: string;
  reviewDate: Date;
  doctorNic: DonorModel;
}

export interface SubmissionHistoryOutputModel {
  submissionHistory: SubmissionHistoryModel[];
  hasMoreSubmissions: boolean;
}
