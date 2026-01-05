/**
 * @param {number} number
 * @param {string[]} wordForms - массив форм в формате [1, 2, много], например ['вопрос', 'вопроса', 'вопросов']
 * @returns
 */
export const getDeclension = (number, wordForms) => {
  const cases = [2, 0, 1, 1, 1];

  return wordForms[number % 100 === 11 ? 2 : cases[number % 10] ?? 2];
};
