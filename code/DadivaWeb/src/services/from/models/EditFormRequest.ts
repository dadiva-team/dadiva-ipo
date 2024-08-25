import { QuestionModel, Rule } from './FormOutputModel';

export interface EditFormRequest {
  language: string;
  groups: { name: string; questions: QuestionModel[] }[];
  rules: Rule[];
  reason?: string | null;
}
