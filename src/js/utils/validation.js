import { z } from 'zod';

export const Option = z.object({
  id: z.number(),
  text: z.string().min(1),
  correct: z.boolean(),
  message: z.string(),
});

export const Question = z.object({
  id: z.number(),
  text: z.string().min(1),
  type: z.enum(['single', 'multiple']),
  options: z.array(Option),
});

export const Quiz = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  questions: z.array(Question),
});

/**
 * @param {JSON} jsonString
 */
export function validateQuizJson(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const result = Quiz.safeParse(data);

    if (!result.success) {
      throw new Error(result.error || 'Невалидный формат JSON');
    }

    return { isValid: true, data: result.data };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}

/**
 * @typedef {z.infer<typeof Option>} TOption
 * @typedef {z.infer<typeof Question>} TQuestion
 * @typedef {z.infer<typeof Quiz>} TQuiz
 */

/** @type {TOption} */
export const TOption = undefined;

/** @type {TQuestion} */
export const TQuestion = undefined;

/** @type {TQuiz} */
export const TQuiz = undefined;
