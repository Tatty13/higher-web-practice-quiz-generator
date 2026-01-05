import {} from '../components/header';
import utils from '../utils';

const quizCardTemplate = document.querySelector('#quiz-card-template');
const quizzesSection = document.querySelector('.quizzes');
const noQuizzesSection = document.querySelector('.no-quizzes');
const quizzesListElement = document.querySelector('.quizzes__list');

const storage = new utils.storage.QuizzesStorage();

const handleNoQuizzes = () => {
  utils.element.showElement(noQuizzesSection);
  utils.element.hideElement(quizzesSection);
};

/**
 * @param {ReturnType<typeof storage.getQuiz>} quiz
 * @returns
 */
const createQuizCardElement = (quiz) => {
  const quizCardElement = utils.element.getElementFromTemplate(
    quizCardTemplate,
    '.quiz-card'
  );
  const quizCardTitleElement =
    quizCardElement.querySelector('.quiz-card__title');
  const quizCardDescriptionElement = quizCardElement.querySelector(
    '.quiz-card__description'
  );
  const questionCountElement = quizCardElement.querySelector(
    '.quiz-card__question-count'
  );
  const quizLinkElement = quizCardElement.querySelector('.button__type_text');
  const questionCount = quiz.questions.length;
  const declension = utils.declension.getDeclension(questionCount, [
    'вопрос',
    'вопроса',
    'вопросов',
  ]);

  quizCardTitleElement.textContent = quiz.title;
  quizCardDescriptionElement.textContent = quiz.description;
  questionCountElement.textContent = `${questionCount} ${declension}`;
  quizLinkElement.setAttribute('href', `./quiz.html?id=${quiz.id}`);

  return quizCardElement;
};

/**
 * @param {ReturnType<typeof storage.getAllQuizzes>} quizzesData
 */
const renderQuizzes = (quizzesData) => {
  quizzesData.forEach((quiz) => {
    const quizCardElement = createQuizCardElement(quiz);
    quizzesListElement.append(quizCardElement);
  });
};

const initPage = async () => {
  const quizzes = await storage.getAllQuizzes();

  if (!quizzes.length) {
    handleNoQuizzes();
    return;
  }

  renderQuizzes(quizzes);
};

await initPage();
