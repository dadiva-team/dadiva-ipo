import { RuleProperties } from 'json-rules-engine';

export class Form {
  questions: Question[];
  rules: RuleProperties[];
}

export class Question {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
  // color: Record<string, string> = { yes: 'green', no: 'red' };
}
