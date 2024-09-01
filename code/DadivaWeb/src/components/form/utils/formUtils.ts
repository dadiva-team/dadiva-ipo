import { COLORS } from '../../../services/utils/colors';

export const EMPTY_ANSWER = { type: 'string', value: '' } as Answer;

export interface Answer {
  type: 'string' | 'boolean' | 'array';
  value: string | boolean | string[];
}

export function updateFormAnswers(
  formAnswers: Record<string, Answer>[],
  currentGroup: number,
  questionId: string,
  answer: string | boolean | string[]
) {
  let answerType: 'string' | 'boolean' | 'array';

  if (typeof answer === 'string') {
    answerType = 'string';
  } else if (typeof answer === 'boolean') {
    answerType = 'boolean';
  } else if (Array.isArray(answer)) {
    answerType = 'array';
  }

  const updatedAnswer: Answer = {
    type: answerType,
    value: answer,
  };

  return [
    ...formAnswers.slice(0, currentGroup),
    {
      ...formAnswers[currentGroup],
      [questionId]: updatedAnswer,
    },
    ...formAnswers.slice(currentGroup + 1),
  ];
}

export const updateShowQuestions = (
  showQuestions: Record<string, boolean>[],
  currentGroup: number,
  questionId: string,
  show: boolean
) => {
  return showQuestions.map((group, index) => {
    if (index === currentGroup) {
      return { ...group, [questionId]: show };
    }
    return group;
  });
};

export function updateQuestionColors(answer: Answer) {
  if (answer.type === 'string' || answer.type === 'array') {
    return (answer.value as string | string[]).length > 0 ? COLORS.LIGHT_GREEN : COLORS.LIGHT_RED;
  } else if (answer.type === 'boolean') {
    return (answer.value as boolean) ? COLORS.LIGHT_GREEN : COLORS.LIGHT_RED;
  }
}

export function simplifyAnswers(
  formAnswers: Record<string, Answer>[],
  currentGroup: number
): Record<string, string | boolean | string[]> {
  return Object.keys(formAnswers[currentGroup]).reduce<Record<string, string | boolean | string[]>>((acc, key) => {
    const answer = formAnswers[currentGroup][key];

    let value: string | boolean | string[];

    if (answer.type === 'boolean') {
      value = answer.value ? 'yes' : 'no';
    } else {
      value = answer.value;
    }

    acc[key] = value;
    return acc;
  }, {});
}

export interface SubmitFormResponse {
  success: boolean;
  submissionDate?: Date;
}
