import {} from '../components/header';
import { Toast } from '../components/toast';
import utils from '../utils';

const { TResult, checkAnswer } = utils.quizAnswer;
const { TOption, TQuestion } = utils.validation;
const { getElementFromTemplate, hideElement, showElement } = utils.element;

const singleQuestionTemplate = document.querySelector(
  '#single-question-template'
);
const multipleQuestionTemplate = document.querySelector(
  '#multiple-question-template'
);

const radioOptionTemplate = document.querySelector('#option-template');
const checkboxOptionTemplate = document.querySelector(
  '#checkbox-option-template'
);

const modalResultContainer = document.querySelector('.modal');
const modalTitle = modalResultContainer.querySelector('.modal__title');
const modalSubtitle = modalResultContainer.querySelector('.modal__subtitle');
const modalDescription = modalResultContainer.querySelector(
  '.modal__description'
);
const modalReattemptBtn = modalResultContainer.querySelector(
  '.modal__reattempt-btn'
);

const quizSection = document.querySelector('.quiz');
const quizTitleElement = quizSection.querySelector('.quiz__title');
const quizSubtitleElement = quizSection.querySelector('.quiz__subtitle');

const progressContainer = quizSection.querySelector('.progress');
const progressLabelElement =
  progressContainer.querySelector('.progress__label');
const progressBarElement = progressContainer.querySelector('.progress__bar');

const quizFormElement = quizSection.querySelector('.quiz__form');
const quizQuestionContainerElement =
  quizFormElement.querySelector('.quiz__question');
const quizSubmitButtonElement =
  quizFormElement.querySelector('.quiz__submit-btn');
const quizNextButtonElement = quizFormElement.querySelector('.quiz__next-btn');

const storage = new utils.storage.QuizzesStorage();
const toast = new Toast({
  selector: '.toast',
});
toast.setEventListeners();

const QUESTION_SEARCH_PARAM = 'question';

let quizData = {};
let currQuestionId = 0;
let correctAnswersCount = 0;

/**
 * @param {string} questionType
 * @returns
 */
const checkIsSingleQuestion = (questionType) => questionType === 'single';

const updateQuestionNumberInUrl = () => {
  utils.url.setSearchParams(QUESTION_SEARCH_PARAM, currQuestionId + 1);
};

/**
 * @param {object} params
 * @param {HTMLTemplateElement} params.template
 * @param {TOption} params.optionData
 * @param {TResult} params.result
 */
const generateOption = ({ template, optionData, result }) => {
  const optionContainer = getElementFromTemplate(template, '.option');
  const optionTextElement = optionContainer.querySelector('.option__text');
  const optionInputElement = optionContainer.querySelector('.option__input');

  optionTextElement.textContent = optionData.text;
  optionInputElement.value = optionData.id;

  if (result) {
    const optionMessageElement =
      optionContainer.querySelector('.option__message');
    const optionLabel = optionContainer.querySelector('.option__label');

    optionInputElement.setAttribute('disabled', true);

    const text = result.texts.find(({ id }) => id === optionData.id);

    if (text) {
      optionInputElement.setAttribute('checked', true);
    }

    const optionType = optionData.correct
      ? 'success'
      : text && !text.isSuccess
      ? 'error'
      : 'default';

    const message = optionData.correct
      ? optionData.message
      : text
      ? text.message
      : '';

    optionLabel.classList.add(`option__label_type_${optionType}`);
    optionMessageElement.textContent = message;
  }

  return optionContainer;
};

/**
 * @param {object} params
 * @param {TQuestion} params.question
 * @param {TResult} params.result
 */
const renderQuestion = ({ question, result }) => {
  const isSingleQuestion = checkIsSingleQuestion(question.type);
  const questionTemplate = isSingleQuestion
    ? singleQuestionTemplate
    : multipleQuestionTemplate;

  const optionTemplate = isSingleQuestion
    ? radioOptionTemplate
    : checkboxOptionTemplate;

  const questionContainer = getElementFromTemplate(
    questionTemplate,
    '.question'
  );

  const questionTextElement =
    questionContainer.querySelector('.question__text');
  const optionsContainer =
    questionContainer.querySelector('.question__options');

  questionTextElement.textContent = question.text;

  const options = question.options.map((optionData) => {
    return generateOption({ template: optionTemplate, optionData, result });
  });
  optionsContainer.replaceChildren(...options);

  quizQuestionContainerElement.replaceChildren(questionContainer);
};

const updateProgress = () => {
  const questionNumber = currQuestionId + 1;
  progressLabelElement.textContent = `Вопрос ${questionNumber} из ${quizData.questions.length}`;
  progressBarElement.value = questionNumber;
};

/**
 * @param {ReturnType<typeof storage.getQuiz>} quiz
 */
const renderQuiz = (quiz) => {
  quizTitleElement.textContent = quiz.title;
  quizSubtitleElement.textContent = quiz.description;

  progressBarElement.setAttribute('max', quiz.questions.length);
  updateProgress();

  const currQuestion = quiz.questions[currQuestionId];

  updateQuestionNumberInUrl();
  renderQuestion({ question: currQuestion });
};

/**
 *
 * @param {TResult} result
 */
const showQuestionResult = (result) => {
  const currQuestion = quizData.questions[currQuestionId];

  renderQuestion({
    question: currQuestion,
    result,
  });

  hideElement(quizSubmitButtonElement);
  showElement(quizNextButtonElement);
};

const getResultModalTextConfig = () => {
  const questionsCount = quizData.questions.length;
  const declension = utils.declension.getDeclension(questionsCount, [
    'вопроса',
    'вопросов',
    'вопросов',
  ]);

  const efficiency = correctAnswersCount / questionsCount;

  if (efficiency === 1) {
    return {
      title: 'Тест завершён!',
      subtitle: 'Вы ответили правильно на все вопросы 🎉',
      description: 'Ваши знания на высоте — вы уверенно разбираетесь в теме.',
    };
  }

  if (efficiency >= 0.5) {
    return {
      title: 'Хороший результат!',
      subtitle: `Вы ответили правильно на ${correctAnswersCount} из ${questionsCount} ${declension}`,
      description:
        'Отличная попытка! Вы хорошо понимаете тему, но некоторые вопросы стоит освежить. Пройдите тест ещё раз, чтобы закрепить знания.',
    };
  }

  return {
    title: 'Не расстраивайтесь!',
    subtitle: `Вы ответили правильно только на ${correctAnswersCount} из  ${questionsCount} ${declension}`,
    description:
      'Не переживайте — ошибки это часть обучения. Попробуйте пройти тест снова, чтобы закрепить материал и улучшить результат.',
  };
};

const renderResultModal = () => {
  const resultModalTextConfig = getResultModalTextConfig();

  modalTitle.textContent = resultModalTextConfig.title;
  modalSubtitle.textContent = resultModalTextConfig.subtitle;
  modalDescription.textContent = resultModalTextConfig.description;

  utils.url.removeSearchParam(QUESTION_SEARCH_PARAM);
  hideElement(quizSection);
  showElement(modalResultContainer);
};

const restartQuiz = () => {
  currQuestionId = 0;
  correctAnswersCount = 0;
  renderQuiz(quizData);

  hideElement(modalResultContainer);
  showElement(quizSection);
};

const goToNextQuestion = () => {
  currQuestionId++;

  if (currQuestionId === quizData.questions.length - 1) {
    quizNextButtonElement.textContent = 'Завершить тест';
  }

  if (currQuestionId === quizData.questions.length) {
    hideElement(quizSection);
    renderResultModal();
    hideElement(quizNextButtonElement);
    showElement(quizSubmitButtonElement);
    quizNextButtonElement.textContent = 'Следующий вопрос';
    return;
  }

  const currQuestion = quizData.questions[currQuestionId];
  renderQuestion({
    question: currQuestion,
  });

  hideElement(quizNextButtonElement);
  showElement(quizSubmitButtonElement);
  updateQuestionNumberInUrl();
  updateProgress();
};

const handleFormSubmit = (evt) => {
  evt.preventDefault();

  const selectedValuesElements = quizQuestionContainerElement.querySelectorAll(
    'input[name="question"]:checked'
  );
  const selectedValuesElementsArr = Array.from(selectedValuesElements);

  if (!selectedValuesElementsArr.length) {
    toast.show({ title: 'Не выбран вариант ответа' });
    return;
  }

  const currQuestion = quizData.questions[currQuestionId];

  const answer = selectedValuesElementsArr.map((element) => element.value);
  const result = checkAnswer(currQuestion?.options, answer);

  if (result.isCorrect) {
    correctAnswersCount++;
  }
  showQuestionResult(result);
};

const initPage = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    quizData = await storage.getQuiz(quizId);

    renderQuiz(quizData);
  } catch (error) {
    console.log('error from initPage', error);
  }
};

await initPage();

quizFormElement.addEventListener('submit', handleFormSubmit);
quizNextButtonElement.addEventListener('click', goToNextQuestion);
modalReattemptBtn.addEventListener('click', restartQuiz);
