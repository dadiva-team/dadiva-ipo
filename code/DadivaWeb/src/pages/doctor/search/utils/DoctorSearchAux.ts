import { Group } from '../../../../domain/Form/Form';
import { Answers } from '../../../../domain/Submission';
import { RuleProperties } from 'json-rules-engine';

export interface QuestionWithAnswer {
  id: string;
  question: string;
  answer: string | boolean;
}

export interface Inconsistency {
  questionId: string;
  invalidValue: string | boolean;
}

export interface DoctorViewProps {
  formGroups: Group[];
  donorAnswers: Answers[];
}

export function buildFormWithAnswers({ formGroups, donorAnswers }: DoctorViewProps): QuestionWithAnswer[] {
  const answerMap = new Map(donorAnswers?.map(answer => [answer.questionId, answer.answer]));

  return formGroups.flatMap(group =>
    group.questions.map(question => ({
      id: question.id,
      question: question.text,
      answer: answerMap.get(question.id) || 'NO ANSWER GIVEN',
    }))
  );
}

export function checkFormValidity(
  formWithAnswers: QuestionWithAnswer[],
  inconsistencies: Inconsistency[]
): { invalidQuestions: QuestionWithAnswer[] } {
  console.log('Form with answers ', formWithAnswers);
  console.log('Inconsistencies ', inconsistencies);
  const invalidQuestions = formWithAnswers?.filter(question => {
    const inconsistency = inconsistencies?.find(inc => inc?.questionId === question.id);
    if (!inconsistency) return false;

    return question.answer === inconsistency.invalidValue;
  });

  return { invalidQuestions };
}

export function extractInconsistencies(ruleProperty: RuleProperties): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];

  const condition = ruleProperty.conditions;

  if ('all' in condition && condition.all) {
    condition.all.forEach(subCondition => {
      if ('fact' in subCondition && 'value' in subCondition) {
        inconsistencies.push({
          questionId: subCondition.fact,
          invalidValue: subCondition.value,
        });
      }
    });
  }

  console.log('Inconsistencies ', inconsistencies);
  return inconsistencies;
}
