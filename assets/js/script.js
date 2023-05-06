// General Knowledge Questions

let questions = [];


// Function that will load the quiz questions from the Open tdb API

function loadQuizQuestion() {
    const APIUrl = `https://opentdb.com/api.php?amount=10&category=9&type=multiple`;
    fetch(APIUrl)
        .then(result => result.json())
        .then(data => showQuestion(data.results));
}
