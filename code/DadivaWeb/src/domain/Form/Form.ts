import { RuleProperties } from 'json-rules-engine';

export class Form {
  groups: { name: string; questions: Question[] }[];
  rules: RuleProperties[];
}

export class Question {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
}
