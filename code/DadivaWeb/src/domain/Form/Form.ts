import { RuleProperties } from 'json-rules-engine';

export interface Form {
  groups: Group[];
  rules: RuleProperties[];
}

export interface Group {
  name: string;
  questions: Question[];
}

export interface ShowCondition {
  after?: string[];
  if?: Record<string, string>;
}

export class Question {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
  showCondition?: ShowCondition;
}
