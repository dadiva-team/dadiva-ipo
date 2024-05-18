import { RuleProperties } from 'json-rules-engine';

export interface Form {
  groups: Group[];
  rules: RuleProperties[];
}

export interface Group {
  name: string;
  questions: Question[];
}

export class Question {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
}
