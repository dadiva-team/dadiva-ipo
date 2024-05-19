import { Form, Question } from '../../../domain/Form/Form';
import { RuleProperties, TopLevelCondition } from 'json-rules-engine';

export interface FormOutputModel {
  groups: { name: string; questions: Question[] }[];
  rules: Rule[];
}

export interface Rule {
  conditions: {
    all?: Condition[];
    any?: Condition[];
  };
  event: Event;
}

export type Condition = ConditionModel | TopLevelCondition;

export interface ConditionModel {
  all?: Condition[];
  any?: Condition[];
}

function transformConditionModel(condition: ConditionModel | TopLevelCondition): TopLevelCondition {
  if ('all' in condition && condition.all) {
    return { all: condition.all.map(transformConditionModel) };
  } else if ('any' in condition && condition.any) {
    return { any: condition.any.map(transformConditionModel) };
  } else {
    // If it's already a TopLevelCondition without nested ConditionModel, return as is
    return condition as TopLevelCondition;
  }
}

function transformRule(rule: Rule): RuleProperties {
  const conditions = transformConditionModel(rule.conditions);
  return {
    conditions,
    event: rule.event,
  };
}

function transformRules(rules: Rule[]): RuleProperties[] {
  return rules.map(transformRule);
}

export function ModelToDomain(model: FormOutputModel): Form {
  return {
    groups: model.groups,
    rules: transformRules(model.rules),
  };
}
