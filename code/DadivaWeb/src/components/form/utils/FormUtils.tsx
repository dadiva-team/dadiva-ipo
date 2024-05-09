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
