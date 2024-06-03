import { Group } from "../../../../domain/Form/Form";
import { Answers } from "../../../../domain/Submission";

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

export function BuildFormWithAnswers({ formGroups, donorAnswers }: DoctorViewProps): QuestionWithAnswer[] {
  const answerMap = new Map(donorAnswers?.map(answer => [answer.questionId, answer.answer]));

  return formGroups.flatMap(group =>
    group.questions.map(question => ({
      id: question.id,
      question: question.text,
      answer: answerMap.get(question.id) || 'NO ANSWER GIVEN',
    }))
  );
}

export function CheckFormValidity(
  formWithAnswers: QuestionWithAnswer[],
  inconsistencies: Inconsistency[]
): { invalidQuestions: QuestionWithAnswer[] } {
  const invalidQuestions = formWithAnswers?.filter(question => {
    const inconsistency = inconsistencies?.find(inc => inc?.questionId === question.id);
    if (!inconsistency) return false;

    return question.answer !== inconsistency.invalidValue;
  });

  return { invalidQuestions };
}