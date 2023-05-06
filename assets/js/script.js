// General Knowledge Questions

let questions = [];


// Function that will load the quiz questions from the Open tdb API

function loadQuizQuestion() {
    const APIUrl = `https://opentdb.com/api.php?amount=10&category=9&type=multiple`;
    fetch(APIUrl)
        .then(result => result.json())
        .then(data => showQuizQuestion(data.results));
}


// Function that will return the quiz questions and answers data

function showQuizQuestion(data) {
    const something = data.map(item => {
        return {
            difficulty: item.difficulty,
            question: item.question,
            correctAnswer: item.correct_answer,
            answers: [...item.incorrect_answers, item.correct_answer]
        };
    });

    questions.push(...something);
    console.log(questions);
}

loadQuizQuestion();