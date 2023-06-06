const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. halt", "4. exit"],
    answer: "1. break",
  },
];

const startButton = document.getElementById("start-btn");
const questionContainer = document.querySelector('.main-container');
const timeElement = document.getElementById("time");
const leaderboardButton = document.getElementById("leaderboard");

let currentQuestionIndex = 0;
let score = 0;
let time = 50;
let timerInterval;
function createOptionElement(option) {
  const li = document.createElement('li');
  li.classList.add('options');
  li.textContent = option;
  return li;
}

function displayQuestion() {
  if (time <= 0) {
    endQuiz();
    return;
  }

  const question = questions[currentQuestionIndex];

  // Create question container
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question");
  
  const questionText = document.createElement("h2");
  questionText.classList.add('question-text');
  questionText.textContent = question.questionText;
  questionDiv.appendChild(questionText);
  
  const optionsList = document.createElement("ul");
  question.options.forEach(option => {
    optionsList.appendChild(createOptionElement(option));
  });
  questionDiv.appendChild(optionsList);

  const answerStatus = document.createElement("p");
  answerStatus.classList.add('answer-status');
  questionDiv.appendChild(answerStatus);
  
  questionContainer.innerHTML = ""; // clear the container
  questionContainer.appendChild(questionDiv);
}

const endQuiz = () => {
  clearInterval(timerInterval);
  questionContainer.innerHTML = `
    <h2>All Done</h2>
    <p>Your final score is: ${score}</p>
    <input type="text" id="initials" placeholder="Enter your initials" />
    <button id="submit-score" class='btn'>Submit</button>
  `;

  document.getElementById("submit-score").addEventListener("click", () => {
    const initials = document.getElementById("initials").value;
    if (initials === '') {
      alert("Initials cannot be empty!");
      return;
    }

    stopTimer();
    
    const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    highscores.push({ initials, score });
    localStorage.setItem("highscores", JSON.stringify(highscores));
    displayHighscores();
    
    const goBack = document.createElement("button");
    goBack.id = "go-back";
    goBack.className = "btn";
    goBack.textContent = "Go Back";
    goBack.addEventListener("click", restartQuiz);
    questionContainer.appendChild(goBack);

    const resetHighScore = document.createElement("button");
    resetHighScore.id = "reset-highScore";
    resetHighScore.className = "btn";
    resetHighScore.textContent = "Clear Highscores";
    resetHighScore.addEventListener("click", clearHighScores);
    questionContainer.appendChild(resetHighScore);
  });
};

function startQuiz() {
  displayQuestion();
  startButton.style.display = "none";

  timerInterval = setInterval(() => {
    time--;
    timeElement.textContent = time;
    if (time <= 0) {
      endQuiz();
    }
  }, 1000);
}

function displayHighscores() {
  questionContainer.innerHTML = ""; 
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  const header = document.createElement("h2");
  header.textContent = "Highscores";
  questionContainer.appendChild(header);
  highscores.forEach((score, index) => {
    const p = document.createElement("p");
    p.textContent = `${index + 1}. ${score.initials}: ${score.score}`;
    questionContainer.appendChild(p);
  });
}

const displayNextQuestion = (selectedOption) => {
  checkAnswer(selectedOption, currentQuestionIndex);
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      endQuiz();
    }
  }, 500);
};

const clearHighScores = () => {
  localStorage.removeItem("highscores");
  displayHighscores();
};

function stopTimer() {
  clearInterval(timerInterval);
  time = 50; // Reset the time
  timeElement.textContent = time; // Update the time display
}

function displayStartScreen() {
  questionContainer.innerHTML = `
    <h1>Coding Quiz Challenge</h1>
    <p>Try to answer the following code-related questions within the time limit.</p>
    <p>Keep in mind that incorrect answers will penalize your score/time by ten seconds!</p>
    <button id="start-btn">Start Quiz</button>
  `;
  
  // Assign a new click event listener for the new start button
  document.getElementById("start-btn").addEventListener("click", startQuiz);
}

const checkAnswer = (selectedOption, questionIndex) => {
  const questionDiv = questionContainer.querySelector('.question');
  const answerStatus = questionDiv.querySelector(".answer-status");
  if (selectedOption === questions[questionIndex].answer) {
    answerStatus.innerHTML = "Correct!";
    answerStatus.classList.add("correct-answer");
    score++;
  } else {
    answerStatus.innerHTML = "Wrong!";
    answerStatus.classList.add("wrong-answer");
    time -= 10;
  }
};

const restartQuiz = () => {
  currentQuestionIndex = 0;
  score = 0;
  time = 50;
  stopTimer();
  displayStartScreen();
};

startButton.addEventListener("click", startQuiz);

questionContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const selectedOption = event.target.textContent.trim();
    displayNextQuestion(selectedOption);
  }
});

leaderboardButton.addEventListener("click", displayHighscores);