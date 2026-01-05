const BUSINESS_LOGIC_ERROR_NAME = 'BUSINESS_LOGIC_ERROR';
export const UNKNOWN_ERROR_MESSAGE = 'Неизвестная ошибка';

/**
 * @param {Error} error
 * @returns
 */
export const isBusinessLogicError = (error) =>
  error instanceof BusinessLogicError;

export class BusinessLogicError extends Error {
  /**
   * @param {string} message
   * @param {string} description
   */
  constructor(message, description) {
    super(message);
    this.name = BUSINESS_LOGIC_ERROR_NAME;
    this.description = description;
  }
}
