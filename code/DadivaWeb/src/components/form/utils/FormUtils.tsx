// Separates the letter and number of the question id
export function parseQuestionId(questionId: string): { letter: string; number: number } {
  if (!questionId) return { letter: '', number: -1 };
  const question = questionId.split(/(\d+)/).filter(Boolean);

  return { letter: question[0], number: parseInt(question[1]) };
}
