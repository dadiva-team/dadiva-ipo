import { ConditionProperties, RuleProperties } from 'json-rules-engine';
import { SubmissionAnsweredQuestionModel } from '../../../../services/doctors/models/SubmissionOutputModel';

export interface QuestionWithAnswer {
  id: string;
  type: string;
  question: string;
  answer: string | boolean | string[];
}

export interface Inconsistency {
  rules: RuleProperties[];
}

function evaluateRule(ruleProperty: RuleProperties, answeredQuestions: SubmissionAnsweredQuestionModel[]): string[] {
  const invalidQuestionIds: string[] = [];
  const condition = ruleProperty.conditions;

  if ('all' in condition) {
    for (const subCondition of condition.all) {
      const answeredQuestion = answeredQuestions.find(
        q => q.question.id === (subCondition as ConditionProperties).fact
      );

      if (answeredQuestion && !evaluateCondition(subCondition as ConditionProperties, answeredQuestion)) {
        invalidQuestionIds.push((subCondition as ConditionProperties).fact);
      }
    }
    return invalidQuestionIds.length === condition.all.length ? invalidQuestionIds : [];
  }

  return [];
}

function evaluateCondition(condition: ConditionProperties, answeredQuestion: SubmissionAnsweredQuestionModel): boolean {
  const { fact, operator, value } = condition;

  if (answeredQuestion.question.id !== fact) {
    return true;
  }

  const answer = answeredQuestion.answer;

  switch (operator) {
    case 'equal':
      return answer === value;
    case 'notEqual':
      return answer !== value;
    case 'greaterThan':
      return typeof answer === 'number' && answer > value;
    case 'lessThan':
      return typeof answer === 'number' && answer < value;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

export function checkInconsistencies(
  answeredQuestions: SubmissionAnsweredQuestionModel[],
  rules: RuleProperties[]
): string[][] {
  const invalidGroups: string[][] = [];

  console.log('answeredQuestions', answeredQuestions);
  console.log('rules', rules);

  for (const rule of rules) {
    const invalidIds = evaluateRule(rule, answeredQuestions);
    if (invalidIds.length > 0) {
      invalidGroups.push(invalidIds);
    }
  }

  return invalidGroups;
}
