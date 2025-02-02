import { RuleProperties } from 'json-rules-engine';

export interface SubmissionOutputModel {
  submission: SubmissionModel;
  lockedByDoctorNic?: number;
}

export interface SubmissionModel {
  id: number;
  submissionDate: string;
  status: Status;
  answeredQuestions: SubmissionAnsweredQuestionModel[];
  donor: DonorModel;
  inconsistencies?: RuleProperties[];
  lock: LockModel;
}

export interface DonorModel {
  name: string;
  nic: string;
}

export interface SubmissionAnsweredQuestionModel {
  id: number;
  question: QuestionModel;
  answer: AnswerType;
  noteText?: string | null;
}

export interface QuestionModel {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[] | null;
}

type AnswerType = string | boolean | string[];

interface LockModel {
  entityId: number;
  doctor: DonorModel;
  lockDate: string;
}

export enum QuestionType {
  boolean = 0,
  text = 1,
  dropdown = 2,
  medications = 3,
  countries = 4,
}

export enum Status {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

/*function ToStausFilter(status: Status) {
  switch (status) {
    case Status.PENDING:
      return 'approved';
    case Status.APPROVED:
      return 'Aprovado';
    case Status.REJECTED:
      return 'Rejeitado';
    default:
      return '';
  }
}*/
