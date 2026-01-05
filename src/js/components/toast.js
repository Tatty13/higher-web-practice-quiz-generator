import { hideElement, showElement } from '../utils/element';

export class Toast {
  constructor({ selector, handleClose }) {
    this._container = document.querySelector(selector);
    this._titleElement = this._container.querySelector('.toast__title');
    this._descriptionElement = this._container.querySelector(
      '.toast__description'
    );
    this._reattemptBtnElement = this._container.querySelector('.button');
    this._handleClose = handleClose;

    this._close = this._close.bind(this);
  }

  /**
   * @param {object} params
   * @param {string} params.title
   * @param {string} params.description
   */
  show({ title, description }) {
    this._titleElement.textContent = title;
    this._descriptionElement.textContent = description;
    showElement(this._container);
  }

  _hide() {
    hideElement(this._container);
  }

  _close() {
    this._hide();
    this._handleClose?.();
  }

  setEventListeners() {
    this._reattemptBtnElement.addEventListener('click', this._close);
  }
}
