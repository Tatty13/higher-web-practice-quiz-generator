import {} from '../components/header';
import { Toast } from '../components/toast';
import utils from '../utils';

const quizGeneratorFormElement = document.querySelector(
  '.quiz-generator__form'
);
const quizGeneratorInputElement = quizGeneratorFormElement.querySelector(
  '#quiz-generator-input'
);

const storage = new utils.storage.QuizzesStorage();

const clearQuizGeneratorInput = () => {
  quizGeneratorInputElement.classList.remove(
    'quiz-generator__textarea_invalid'
  );
  quizGeneratorInputElement.value = '';
};

const highlightQuizGeneratorInputError = () => {
  quizGeneratorInputElement.classList.add('quiz-generator__textarea_invalid');
};

const handleReattemptBtnClick = () => {
  clearQuizGeneratorInput();
};

const toast = new Toast({
  selector: '.toast',
  handleClose: handleReattemptBtnClick,
});
toast.setEventListeners();

const saveQuizToDataBase = async (data) => {
  try {
    await storage.saveQuiz(data);
    window.location.href = './quizzes.html';
  } catch (err) {
    throw new utils.error.BusinessLogicError(
      'Ошибка сохранения квиза в базу данных',
      err.message
    );
  }
};

const handleQuizGeneratorFormSubmit = async (evt) => {
  try {
    evt.preventDefault();
    const inputValue = quizGeneratorInputElement.value;

    if (!inputValue) {
      return;
    }

    const validationResult = utils.validation.validateQuizJson(inputValue);

    if (!validationResult.isValid) {
      throw new utils.error.BusinessLogicError(
        'Ошибка: не удалось обработать JSON.',
        'Проверьте формат данных и попробуйте снова.'
      );
    }

    await saveQuizToDataBase(validationResult.data);
  } catch (err) {
    const isBusinessLogicError = utils.error.isBusinessLogicError(err);
    const title =
      (isBusinessLogicError && err.message) ||
      utils.error.UNKNOWN_ERROR_MESSAGE;

    const description = (isBusinessLogicError && err.description) || '';

    toast.show({ title, description });
    highlightQuizGeneratorInputError();
  }
};

quizGeneratorFormElement.addEventListener(
  'submit',
  handleQuizGeneratorFormSubmit
);
