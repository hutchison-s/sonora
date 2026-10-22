import type { Question } from '@/lib/types/story';
export function answerIsCorrect(question: Question, selected: number): boolean {
  return Number.isInteger(selected) && selected >= 0 && selected < question.options.length && selected === question.correctIndex;
}
export function correctAnswers(questions: readonly Question[], answers: readonly number[]): number {
  return questions.reduce((total, question, index) => total + (answers[index] !== undefined && answerIsCorrect(question, answers[index]) ? 1 : 0), 0);
}
