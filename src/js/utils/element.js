/**
 * @param {HTMLTemplateElement} template
 * @param {string} elementSelector
 * @returns {HTMLElement}
 */
export const getElementFromTemplate = (template, elementSelector) => {
  const element = template.content
    .querySelector(elementSelector)
    .cloneNode(true);

  return element;
};

/**
 * @param {HTMLElement} element
 */
export const showElement = (element) => {
  element.removeAttribute('hidden');
};

/**
 * @param {HTMLElement} element
 */
export const hideElement = (element) => {
  element.setAttribute('hidden', true);
};
