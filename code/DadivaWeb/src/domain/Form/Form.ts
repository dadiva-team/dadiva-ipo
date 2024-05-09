import { RuleProperties } from 'json-rules-engine';

export interface Form {
  groups: { name: string; questions: Question[] }[];
  rules: RuleProperties[];
}

export interface Question {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
}
