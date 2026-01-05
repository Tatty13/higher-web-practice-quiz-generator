import { openDB } from 'idb';
import { nanoid } from 'nanoid';

import { TQuiz } from './validation';

export class QuizzesStorage {
  constructor() {
    this.storeName = 'quizzes';
    const storeName = this.storeName;
    this.dbPromise = openDB('quizzes-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      },
    });
  }

  /**
   * @param {TQuiz} quizData
   * @returns {string} id
   */
  async saveQuiz(quizData) {
    const db = await this.dbPromise;
    return db.put(this.storeName, { id: nanoid(), ...quizData });
  }

  /**
   * @param {string} id
   * @returns {TQuiz & {id: string}}
   */
  async getQuiz(id) {
    const db = await this.dbPromise;
    return db.get(this.storeName, id);
  }

  /**
   * @returns {Array<TQuiz & {id: string}>}
   */
  async getAllQuizzes() {
    const db = await this.dbPromise;
    return db.getAll(this.storeName);
  }

  /**
   * @param {string} id
   */
  async deleteQuiz(id) {
    const db = await this.dbPromise;
    return db.delete(this.storeName, id);
  }

  async clearAllQuizzes() {
    const db = await this.dbPromise;
    return db.clear(this.storeName);
  }
}
