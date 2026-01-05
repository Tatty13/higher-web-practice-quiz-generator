import { TOption } from './validation';

/**
 * @typedef {{
 *  isCorrect: boolean;
 *  texts: Array<{
 *    id: string;
 *    message: string;
 *    isSuccess: boolean;
 *  }>
 * }} TResult
 */

/** @type {TResult} */
export const TResult = undefined;

/**
 * @param {TOption[]} options
 * @param {string[]} answer
 * @returns {TResult}
 */
export const checkAnswer = (options, answer) => {
  const answerIds = answer.map(Number);

  const correctAnswers = options.filter((option) => option.correct);
  const chosenAnswers = options.filter((option) =>
    answerIds.includes(option.id)
  );

  const isCorrect =
    correctAnswers.length === answerIds.length &&
    correctAnswers.every((correctAnswer) =>
      answerIds.includes(correctAnswer.id)
    );

  return {
    isCorrect,
    texts: chosenAnswers.map((answer) => ({
      id: answer.id,
      message: answer.message,
      isSuccess: answer.correct,
    })),
  };
};
