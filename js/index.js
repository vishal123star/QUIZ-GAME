var apiCaller = (function () {

  var api = 'http://localhost:3000';

  return {
    getQuestions: function () {
      return fetch(api + '/questions').then(function (r) {
        return r.json();
      }, function () {
        return [];
      });
    },

    saveScore: function (payload) {
      return fetch(api + '/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }).then(function (r) {
        return { status: 'success' };
      }, function () {
        return { status: 'error' };
      });
    }
  }

})();


(function () {

  // GET THE REFERENCES OF ALL ELEMENTS
  var startUpScreen = document.getElementById('start-up-screen');
  var questionsBlock = document.getElementById('questions-block');
  var questionsBlockInner = document.getElementById('questions-block-inner');
  var form = document.getElementById('form');
  var studentId = document.getElementById('studentId');
  var level = document.getElementById('level');
  var submitBtn = document.getElementById('submit-btn');
  var timer = document.getElementById('timer');
  var questionSubmitBtn = document.getElementById('question-submit-btn');
  var questionHeader = document.getElementById('question-header');
  var scoreBoard = document.getElementById('score-board');

  // HOLDS THE QUESTIONS DATA
  var questionsData = [];


  // FOR HANDLING THE FORM SUBMIT
  form.addEventListener('submit', function (e) {

    // PREVENTING THE FORM FROM SUBMIT
    e.preventDefault();

    var sid = (studentId.value || "").trim();
    var l = level.value;

    // VALIDATIONS
    if (!sid) {
      alert('Please provide the Student ID');
      return false;
    }

    if (!l) {
      alert('Please choose the Level');
      return false;
    }

    // MAKE SUBMIT BUTTON AS BUSY - LOADER
    submitBtn.textContent = 'Loading...';
    submitBtn.setAttribute('disabled', true);

    apiCaller.getQuestions().then(function (r) {
      startUpScreen.style.display = 'none';
      questionsBlock.style.display = 'block';
      submitBtn.textContent = 'Submit';
      submitBtn.setAttribute('disabled', false);
      questionsData = r;
      prepareQuestionsBlock(questionsData);
      startTimer();
    });

  }, false);

  // FOR QUESTIONS SUBMIT 
  questionSubmitBtn.addEventListener('click', function () {

    // WE ARE CHECKING THE QUESTIONS SUBMITTED BY THE USER
    (questionsData || []).forEach((q, k) => {

      // PICK THE RADIO BUTTONS VALUES
      var e = document.getElementsByName('block_' + k);
      // MARKING USER SELECTED CORRECT INDEX OR NOT
      for (var i = 0; i < e.length; i++) {
        var ni = i + 1;

        // HOLDING THE WHAT USER HAS ANSERED
        if (e[i].checked) {
          q._answeredByUser = i;
        }

        if (e[i].checked == true && q.ans == ni) {
          q._answered = true;
          break;
        } else {
          q._answered = false;
        }
      }
    });

    questionHeader.style.display = 'none';

    questionSubmitBtn.style.display = 'none';

    // REPRINT THE QUESTIONS BLOCK
    prepareQuestionsBlock(questionsData, true);

    // PREPARE SCORE BOARD
    var answered = questionsData.filter(e => e._answered).length;
    var total = questionsData.length;
    var statusList = ['Poor', 'Bad', 'Good', 'Strong', 'Very Strong'];
    var statusColor = ['text-danger', 'text-danger', 'text-warning', 'text-success', 'text-success'];
    var status = statusList[answered > 0 ? answered - 1 : 0];
    var color = statusColor[answered > 0 ? answered - 1 : 0];
    var t = '<strong>Your score: <span class="score">' + answered + '/' + total + '</span></strong>, <strong class="score ' + color + '">' + status + '</strong> <br/> <a href="javascript:;" onclick="location.reload()"><small>Take test Again</small</a>';
    scoreBoard.innerHTML = t;

    // SAVE THE SCORE IN JSON
    apiCaller.saveScore({
      studentId: studentId.value,
      answeredQuestions: answered,
      totalQuestions: total
    });

  }, false);

  function startTimer() {
    var max = 30;
    var v = max;
    var interval = setInterval(() => {
      v -= 1;
      timer.innerHTML = v + ' secs';
      if (v == 0) {
        clearInterval(interval);
        // INVOKE THE QUESTION SUBMIT BUTTON IF TIME IS OVER
        questionSubmitBtn.click();
      }
    }, 1000);
  }


  // WHICH RENDERS THE QUESTIONS BLOCK BASED ON THE DATA
  function prepareQuestionsBlock(questions, showEvaluation) {
    var t = '';

    // FIRST CLEAR THE BLOCK
    questionsBlockInner.innerHTML = '';

    questions.forEach(function (e, k) {
      var ni = k + 1;
      t += '<div class="panel panel-primary">';
      t += '   <div class="panel-body">';
      t += '     <div>';
      t += '       <h5><strong>' + ni + ') ' + e.question + '</strong></h5>';
      t += '     </div>';
      t += '     <div class="row">';

      // FOR OPTION LOOPING
      (e.options || []).forEach(function (ope, k2) {

        // HOLDS THE VALUE OF PREVIOUSLY SELECTED VALUE BY THE USER
        var checked = (showEvaluation && e._answeredByUser == k2) ? 'checked' : '';

        t += '       <div class="col-md-6 col-lg-6 col-xs-6">';
        t += '         <input type="radio" name="block_' + k + '" value="' + k2 + '" ' + checked + '/> ';
        t += '         <span class="lbl">' + ope + '</span>';
        t += '       </div>';
      });

      t += '     </div>';

      if (showEvaluation) {
        t += '<br/>';
        if (e._answered) {
          t += '<div class="text-success"><strong>Correct!!</strong></div>';
        } else {
          t += '<div class="text-danger"><strong>Wrong!!</strong></div>';
          t += '<small>Correct Answer: ' + e.options[e.ans - 1] + '</small>';
        }
      }

      t += '   </div>';
      t += ' </div>';
    });

    questionsBlockInner.innerHTML = t;
  }


})();

