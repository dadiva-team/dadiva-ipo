import {AnsweredQuestionModel} from "../../from/models/AnsweredQuestionModel";
export interface SubmissionOutputModel {
  submission: SubmissionModel;
  lockedByDoctorNic?: number;
}

export interface SubmissionModel {
  id: number;
  nic: number;
  answers: AnsweredQuestionModel[];
  submissionDate: string;
  formVersion: number;
}