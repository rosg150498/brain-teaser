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
     questionText.textContent = `${index + 1}. ${item.question}`;
     questionText.setAttribute('class', 'quiz-question');
     questionElement.appendChild(questionText);
   
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
   }

loadQuizQuestion();

