import { COLORS } from '../../../services/utils/colors';

export function updateFormAnswers(
  formAnswers: Record<string, string>[],
  currentGroup: number,
  questionId: string,
  answer: string
) {
  if (answer == formAnswers[currentGroup][questionId]) return formAnswers;

  return [
    ...formAnswers.slice(0, currentGroup),
    {
      ...formAnswers[currentGroup],
      [questionId]: answer,
    },
    ...formAnswers.slice(currentGroup + 1),
  ];
}

export function updateQuestionColors(questionId: string, questionType: string, answer: string) {
  if (questionType === 'dropdown') {
    return answer.length > 0 ? COLORS.LIGHT_GREEN : COLORS.LIGHT_RED;
  } else {
    return answer == 'yes' ? COLORS.LIGHT_GREEN : COLORS.LIGHT_RED;
  }
}
