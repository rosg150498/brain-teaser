const quizanswers = document.getElementsByClassName('quiz-answers');

// General Knowledge Questions

let questions = [];
let questionIndex = 0;


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
         checkAnswer(answerText, item.correct_answer);
       });
   
       if (index > 0) { // Only add answers to the second and subsequent questions
         questionElement.appendChild(answerElement);
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
    quizanswers.innerHTML = ''; // remove any existing answers

    const answerLetters = ['A', 'B', 'C', 'D'];
    listofAnswers.forEach((answerText, index) => {
        const answerElement = document.createElement('p');
        answerElement.classList.add(`answer-${answerLetters[index]}`);
        answerElement.textContent = `${answerLetters[index]}. ${answerText.replaceAll(/&rsquo;/g, "'").replaceAll(/&auml;/g, 'ä').replaceAll(/&aring;/g, 'å').replaceAll(/&ouml;/g, 'ö').replaceAll(/&oacute;/g, 'ó')}`;

        answerElement.addEventListener('click', () => {
            checkAnswer(answerText, questions[questionIndex].correct_answer);
        });

        quizanswers.appendChild(answerElement); 
    });
}

loadQuizQuestion();