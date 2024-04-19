import { RuleProperties } from 'json-rules-engine';
import { Question } from '../../../domain/Form/Form';

export interface FormOutputModel {
  questions: Question[];
  rules: RuleProperties[];
}
