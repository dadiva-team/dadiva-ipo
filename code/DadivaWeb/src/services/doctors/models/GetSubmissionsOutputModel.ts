export interface SubmissionOutputModel {
  id: number;
  nic: number;
  answers: { questionId: string; answer: string }[];
  submissionDate: string;
}