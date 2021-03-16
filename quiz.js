function populate() {
    if(quiz.isEnded()) {
        showScores();
    }
    else {
        // show question
        var element = document.getElementById("question");
        element.innerHTML = quiz.getQuestionIndex().text;

        // show options
        var choices = quiz.getQuestionIndex().choices;
        for(var i = 0; i < choices.length; i++) {
            var element = document.getElementById("choice" + i);
            element.innerHTML = choices[i];
            guess("bt" + i, choices[i]);
        }

        showProgress();
    }
};

function guess(id, guess) {
    var button = document.getElementById(id);
    button.onclick = function() {
        quiz.guess(guess);
        populate();
    }
};


function showProgress() {
    var currentQuestionNumber = quiz.questionIndex + 1;
    var element = document.getElementById("progress");
    element.innerHTML = "Question " + currentQuestionNumber + " of " + quiz.questions.length;
};

function showScores() {
    var gameOverHTML = "<h1>Result</h1>";
    gameOverHTML += "<h2 id='score'> Your scores: " + quiz.score + "</h2>";
    var element = document.getElementById("quiz");
    element.innerHTML = gameOverHTML;
};

// create questions
var questions = [
    new Question("What is the fullform of HTML?" ["Hyper Text Markup Language", "Hyper Text Mark Language","Hyper Test Markup Language", "Hybrid Text Markup Language"], "Hyper Text Markup Language"),

    new Question("What is the tag used for Paragraph?", ["<p>", "<a>","<b>", "<h>"], "<p>"),
    

    new Question("html document surrounded by_____brackets?", ["square", "round","angle", "curly"], "angle"),
    

    new Question("what is full form of css?", ["cascading style sheets", "colorful style sheets","creative style sheet", "computer style sheet"], "cascading style sheets"),
     
    new Question("what is the tag used for inserting a line horizontally?" ["<hr>", "<line>","<tr>", "td"], "<td>"),   

];


var quiz = new Quiz(questions);


populate();