import { Form, Question, ShowCondition } from '../../../domain/Form/Form';
import { RuleProperties, TopLevelCondition, Event } from 'json-rules-engine';

export interface FormOutputModel {
  groups: { name: string; questions: QuestionModel[] }[];
  rules: Rule[];
}

export class QuestionModel {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
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

function RuleToDomain(rule: Rule): RuleProperties {
  const conditions = transformConditionModel(rule.conditions);
  return {
    conditions,
    event: rule.event,
  };
}

export function RulesToDomain(rules: Rule[]): RuleProperties[] {
  return rules.map(RuleToDomain);
}

function transformTopLevelCondition(condition: TopLevelCondition): ConditionModel | TopLevelCondition {
  if ('all' in condition && condition.all) {
    return { all: condition.all.map(transformTopLevelCondition) };
  } else if ('any' in condition && condition.any) {
    return { any: condition.any.map(transformTopLevelCondition) };
  }

  return condition;
}

function DomainToRule(rule: RuleProperties): Rule {
  const conditions = transformTopLevelCondition(rule.conditions);
  return {
    conditions: conditions as ConditionModel,
    event: rule.event,
  };
}

export function DomainToRules(rules: RuleProperties[]): Rule[] {
  return rules.map(DomainToRule);
}

export function DomainToModel(form: Form): FormOutputModel {
  return {
    groups: form.groups,
    rules: DomainToRules(form.rules),
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildShowCondition(model: FormOutputModel, questionId: string): ShowCondition | undefined {
  //TODO: Implement this function
  return undefined;
}

export function ModelToDomain(model: FormOutputModel): Form {
  const groups = model.groups.map(group => {
    return {
      name: group.name,
      questions: group.questions.map(questionModel => {
        return {
          id: questionModel.id,
          text: questionModel.text,
          type: questionModel.type,
          options: questionModel.options,
          showCondition: buildShowCondition(model, questionModel.id),
        } as Question;
      }),
    };
  });
  return {
    groups: groups,
    rules: RulesToDomain(model.rules),
  };
}
