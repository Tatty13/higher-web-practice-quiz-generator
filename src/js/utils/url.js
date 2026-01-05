/**
 * @param {string} param
 * @param {string | number} value
 */
export const setSearchParams = (param, value) => {
  const url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.pushState(null, null, url);
};

/**
 * @param {string} param
 */
export const removeSearchParam = (param) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(param);
  window.history.pushState(null, null, url);
};
