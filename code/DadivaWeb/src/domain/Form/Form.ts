import { RuleProperties } from 'json-rules-engine';

export interface Form {
  groups: Group[];
  rules: RuleProperties[];
  language: string;
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

export function createEmptyForm(language: string): Form {
  return {
    groups: [] as Group[],
    rules: [] as RuleProperties[],
    language,
  } as Form;
}
