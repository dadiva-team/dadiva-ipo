import { AnsweredQuestionModel } from './AnsweredQuestionModel';

export interface SubmitFormRequest {
  answeredQuestions: AnsweredQuestionModel[];
  formLanguage: string;
}
