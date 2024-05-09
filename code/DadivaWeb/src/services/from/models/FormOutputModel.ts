import { RuleProperties } from 'json-rules-engine';
import { Question } from '../../../domain/Form/Form';

export interface FormOutputModel {
  groups: { name: string; questions: Question[] }[];
  rules: RuleProperties[];
}
