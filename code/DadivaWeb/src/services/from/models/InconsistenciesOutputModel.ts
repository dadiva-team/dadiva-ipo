import { Rule } from './FormOutputModel';
import { RuleProperties } from 'json-rules-engine';

// Assuming this structure is already defined in your models
export interface InconsistenciesOutputModel {
  inconsistencies: RuleWithReason[];
}

export interface RuleWithReason {
  rule: Rule;
  reason: string;
}

export interface RuleWithReasonProperties {
  rule: RuleProperties;
  reason: string;
}
