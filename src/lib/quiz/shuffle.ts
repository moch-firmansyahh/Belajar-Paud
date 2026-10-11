/**
 * Shuffle helpers for quiz questions and options
 */

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface QuestionWithOptions {
  opsi: string[];
  indeksBenar: number;
}

export function shuffleQuestionOptions<T extends QuestionWithOptions>(
  question: T
): T {
  const correctAnswer = question.opsi[question.indeksBenar];
  const shuffledOptions = shuffleArray(question.opsi);
  const newCorrectIndex = shuffledOptions.findIndex(
    (opt) => opt === correctAnswer
  );

  return {
    ...question,
    opsi: shuffledOptions,
    indeksBenar: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}
