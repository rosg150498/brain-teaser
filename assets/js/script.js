const quizanswers = document.querySelector('.quiz-answers');

  function validateName (name) {
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        return nameRegex.test(name);
   }

  function storeName() {

      const name = document.getElementById('name').value

      const nameElement = document.createElement('p');

      nameElement.textContent = `Name: ${name}`;

      document.getElementById('quiz-name').appendChild(nameElement);

   }

   document.getElementById('submit-name').addEventListener('click', storeName);

// General Knowledge Questions

let questions = [];
let questionIndex = 0;
let userAnswer;


// Function that will load the quiz questions from the Open tdb API

function loadQuizQuestion() {
    const APIUrl = `https://opentdb.com/api.php?amount=10&category=9&type=multiple`;
    fetch(APIUrl)
        .then(result => result.json())
        .then(data => showQuizQuestion(data.results));
}


// Function that will return the quiz questions and answers data

function showQuizQuestion(data) {
    const quizElement = document.getElementById('quiz-question');
    quizElement.innerHTML = ''; // remove any existing questions

    data.forEach((item, index) => {
        const questionElement = document.createElement('div');
        questionElement.setAttribute('id', `question-${index}`);
        questionElement.classList.add('question', 'hidden');

        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${item.question.replaceAll(/&#039;/g, "'").replaceAll(/&quot;/g, '"').replaceAll(/&shy;/g, '').replaceAll(/&rdquo;/g, '"')}`;
        questionText.setAttribute('class', 'quiz-question');
        questionElement.appendChild(questionText);

        const answerLetters = ['A', 'B', 'C', 'D'];
        const allAnswers = [...item.incorrect_answers, item.correct_answer];
        allAnswers.sort(() => Math.random() - 0.5); // shuffle answers

        for (let i = 0; i < allAnswers.length; i++) {
            const answerText = allAnswers[i];
            const answerElement = document.createElement('p');

            answerElement.classList.add(`answer-${answerLetters[i]}`);
            answerElement.innerHTML = answerText;

            answerElement.addEventListener('click', () => {
                userAnswer = answerText;
            });

            if (index > 0) { // Only add answers to the second and subsequent questions
                quizanswers.appendChild(answerElement);
            }
        }

        quizElement.appendChild(questionElement);
    });

    questions = data;
    showQuestion();
}

function showQuestion() {
    const allQuestions = document.querySelectorAll('.question');
    allQuestions.forEach(question => {
        question.style.display = 'none';
    });

    const currentQuestion = document.getElementById(`question-${questionIndex}`);
    currentQuestion.style.display = 'block';

    const currentAnswers = questions[questionIndex].incorrect_answers.concat(questions[questionIndex].correct_answer);
    generateAnswers(currentAnswers);
}

function generateAnswers(listofAnswers) {
  const quizanswers = document.querySelector('.quiz-answers');
  quizanswers.innerHTML = '';

  const answerLetters = ['A', 'B', 'C', 'D'];

  listofAnswers.forEach((answerText, index) => {
    const answerElement = document.createElement('p');
    answerElement.classList.add(`answer-${answerLetters[index]}`);

    const radioInput = document.createElement('input');
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('name', 'answer');
    radioInput.setAttribute('value', answerText);
    radioInput.addEventListener('click', () => {
      userAnswer = answerText;
    });

    const answerTextElement = document.createElement('ul');

    answerTextElement.setAttribute('class', 'answers')

    answerTextElement.textContent = `${answerLetters[index]}. ${answerText.replaceAll(/&rsquo;/g, "'").replaceAll(/&auml;/g, 'ä').replaceAll(/&aring;/g, 'å').replaceAll(/&ouml;/g, 'ö').replaceAll(/&oacute;/g, 'ó')}`;

    answerElement.appendChild(radioInput);

    answerElement.appendChild(answerTextElement);

    quizanswers.appendChild(answerElement);
  });


      // End of quiz
    }


loadQuizQuestion();