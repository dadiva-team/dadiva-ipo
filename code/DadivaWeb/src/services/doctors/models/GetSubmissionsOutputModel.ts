export interface SubmissionOutputModel {
  nic: number;
  answers: { questionId: string; answer: string }[];
  submissionDate: string;
}