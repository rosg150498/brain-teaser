const mainmenu = document.getElementById('main-menu');
const quizsection = document.getElementById('quiz');
const leaderboardsection = document.getElementById('leaderboard');
const quizanswers = document.querySelector('.quiz-answers');
const timerElement = document.getElementById('quiz-timer');
const returnMainButton = document.querySelector('.return-main-menu');


// Hiding the quiz and leaderboard sections when the page loads

quizsection.style.display = 'none';

leaderboardsection.style.display = 'none';


// Event listener for the Play Quiz button

document.querySelector('.quiz-play-button').addEventListener('click', function(event) {

  event.preventDefault();


  // Hiding the main menu and leaderboard sections when the quiz sections load

    mainmenu.style.display = 'none';

    leaderboardsection.style.display = 'none';

  
    // Showing the quiz sections when Play Quiz button is clicked on 
    
    quizsection.style.display = 'block';
  
    loadQuizQuestion();
  });
  

  // Event listener for the Return Main button
  returnMainButton.addEventListener('click', function(event) {

  event.preventDefault();

  
  // Hiding the quiz section when showing the main menu section
  quizsection.style.display = 'none';

  mainmenu.style.display = 'block';
});


  function validateName (name) {
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        return nameRegex.test(name);
   }

  function storeName(event) {

    const name = document.getElementById('name').value;

    const nameElement = document.getElementById('quiz-name');

    nameElement.textContent = `Name: ${name}`;
  
    return false; 
  }

   document.getElementById('submit-name').addEventListener('click', function(event) {

     event.preventDefault();

     storeName();
     
   });

// General Knowledge Questions

let questions = [];
let questionIndex = 0;
let userAnswer;
let correctAnswer;
let score = 0;
let timerValue = 110;
let quizresults = [];


// Function that will load the quiz questions from the Open tdb API


function loadQuizQuestion() {
  const APIUrl = `https://opentdb.com/api.php?amount=10&category=9&type=multiple`;
  fetch(APIUrl)
    .then(result => result.json())
    .then(data => {
      questions = data.results; 
      showQuizQuestion();
    });
  }
  

// Function that will return the quiz questions and answers data

function showQuizQuestion(data) {
    const quizElement = document.getElementById('quiz-question');
    quizElement.innerHTML = ''; 

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

    startTimer(endQuiz);
}


/* Show Question Function to display current question and hide all questions from API */

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


/* Generate Answers Function displayed in radio buttons form for user to select */

function generateAnswers(listofAnswers) {
  const quizanswers = document.querySelector('.quiz-answers');
  quizanswers.innerHTML = '';

  const answerLetters = ['A', 'B', 'C', 'D'];

  listofAnswers.sort(() => Math.random() - 0.5);

  listofAnswers.forEach((answerText, index) => {
    const answerElement = document.createElement('p');
    answerElement.classList.add(`answer-${answerLetters[index]}`);

    const radioInput = document.createElement('input');
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('name', 'answer');
    radioInput.setAttribute('value', answerText);
    if (answerText === questions[questionIndex].correct_answer) {
      radioInput.setAttribute('data-correct', 'true');
      correctAnswer = answerText;
    }
    radioInput.addEventListener('click', () => {
      userAnswer = answerText;
    });

    const answerTextElement = document.createElement('span');
    answerTextElement.textContent = `${answerLetters[index]}. ${answerText}`;

    answerElement.appendChild(radioInput);
    answerElement.appendChild(answerTextElement);

    quizanswers.appendChild(answerElement);
  });
}


/* Submit Answer Function providing feedback if no answer is selected */

function submitAnswer() {
  if (userAnswer) {
    const selectedAnswer = document.querySelector(`input[name="answer"]:checked`);
    const isCorrect = selectedAnswer.getAttribute('data-correct') == 'true';

    if (isCorrect) {
      alert('Correct answer!');
      score += 10; 
      document.getElementById('score').textContent = `Score: ${score}`; 
      document.getElementById('score').style.position = 'absolute';
      document.getElementById('score').style.marginTop = '68rem';
      document.getElementById('score').style.marginLeft = '70rem';
      document.getElementById('score').style.color = 'white';
      document.getElementById('score').style.fontSize = '25px';
      document.getElementById('score').style.textDecoration = 'underline';
    } else {
      alert('Incorrect answer!');
    }

    userAnswer = undefined;
    questionIndex++;
    showQuestion();
  } else {
    alert('Please select an answer.');
  }
}


/* Update Timer Display providing feedback to the user */

function updateTimerDisplay() {
    timerElement.textContent = `Quiz Time Remaining: ${timerValue} seconds`;
}


/* Start Quiz Timer */

function startTimer(endCallback) {
    updateTimerDisplay(); 

    const timerInterval = setInterval(() => {
        timerValue--;
        updateTimerDisplay();

        if (timerValue <= 0) {
            clearInterval(timerInterval);
            endCallback(); 
        }
    }, 1000);
}


/* End Quiz Function providing feedback for the user */

function endQuiz() {

    alert(`Time is up! The Quiz has ended. Your score is ${score}`);

     const nameElement = document.getElementById('quiz-name');

     const name = nameElement.textContent.replace('Name: ', '');
    
     const scoreElement = document.getElementById('score');

     const userScore = parseInt(scoreElement.textContent.replace('Score: ', ''));
    
     const userResultsData = { name: name, score: userScore };

     quizresults.push(userResultsData);
    
     resetQuiz();

     displayuserLeaderboard();

}


/* Reset Quiz Function */

function resetQuiz() {
    questionIndex = 0;
    userAnswer = undefined;
    score = 0;
    timerValue = 100;

    const quizElement = document.getElementById('quiz-question');
    quizElement.innerHTML = '';

    const quizAnswersElement = document.querySelector('.quiz-answers');
    quizAnswersElement.innerHTML = '';

     document.getElementById('score').textContent = 'Score: 0';

    loadQuizQuestion();

}


/* Leaderboard Quiz Function */

function displayuserLeaderboard() {

          const leaderboard = document.getElementById('leaderboard');

          leaderboard.innerHTML = '';
        
          const leaderboardTitle = document.createElement('h2');

          leaderboardTitle.textContent = 'Leaderboard';

          leaderboardTitle.classList.add('leaderboard-heading');

          leaderboard.appendChild(leaderboardTitle);

        
          // Display quiz name and score
          const quizName = document.getElementById('quiz-name').textContent.replace('Name: ', '');
 
          const userScore = parseInt(document.getElementById('score').textContent.replace('Score: ', ''));

          const userresultsdata = { name: quizName, score: userScore };

          quizresults.push(userresultsdata);

        
          // Sort leaderboard by score in descending order
          quizresults.sort((a, b) => b.score - a.score);
        
          // Display leaderboard
          quizresults.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        
            leaderboard.appendChild(listItem);
          });
        
          leaderboard.style.display = 'block';
        }


loadQuizQuestion();