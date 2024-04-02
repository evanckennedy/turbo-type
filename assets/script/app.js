'use strict';

// This app requires a server to handle import statements
// and CORS issues
import * as utils from './utils.js';
import Score from './Score.js';
import originalWords from './words.js';

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Selectors, Declaration                               */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const start = utils.select('.start');
const restart = utils.select('.restart');
const timeRemaining = utils.select('.time-remaining');
const hitsDisplay = utils.select('.hits');
const input = utils.select('.user-guess');
const randomWordDisplay = utils.select('.random-word-wrapper p');
const randomWordWrapper = utils.select('.random-word-wrapper');

const gameSound = new Audio('./assets/media/game-sound.mp3');
const correctAnswer = new Audio('./assets/media/correct-answer.mp3');
const gameOver = new Audio('./assets/media/game-over.mp3');
const countdown = new Audio('./assets/media/countdown.mp3')

let count = 99;

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Random Words                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let words = [...originalWords];
let hits = 0;
function guessWord() {
  let randomWord = selectWord();
  randomWordDisplay.textContent = randomWord;


  utils.listen('input', input, () => compareWords(randomWord));
}

function compareWords(currentRandomWord) {
  let userInput = input.value.toLowerCase();
  let word = currentRandomWord.toLowerCase();
  if (userInput === word) {
    hits++;
    correctAnswer.play();
    hitsDisplay.innerText = hits;
    clearInput();
    guessWord();
  }
}

function clearInput() {
  input.value = '';
}

function selectWord() {
let index = Math.floor(Math.random() * words.length);
let word = words[index];
words.splice(index, 1);
return word;
}

function resetWords() {
words = [...originalWords];
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Game Timer                                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let intervalID = null;

function startCount() {
  intervalID = setInterval(() => {
    count --;
    timeRemaining.textContent = count;

    if (count <= 0) {
      clearInterval(intervalID);
      endGame();
    }
  }, 1000);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Start Game                                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function startGame() {
  toggleRandomWordDisplay();
  startCountdown(() => {
    clearInput();
    startCount();
    gameSound.play();
    input.focus();
    hideStart();
    enableInput();
    hitsDisplay.innerText = hits;
    guessWord();
  });
  
}

function startCountdown(callback) {
  let countdownNumber = 3;

  randomWordDisplay.textContent = countdownNumber;
  countdown.play();

  let countdownInterval = setInterval(() => {
    countdownNumber--;
    randomWordDisplay.textContent = countdownNumber;

    if (countdownNumber <= 0) {
      clearInterval(countdownInterval);
      randomWordDisplay.textContent = '';
      callback();
    }
  }, 1000);
}

function stopCount() {
  clearInterval(intervalID);
}

function hideStart() {
  start.classList.add('hidden');
  restart.classList.remove('hidden');
}

function toggleRandomWordDisplay() {
  randomWordWrapper.classList.toggle('hidden');
}

function enableInput() {
  input.classList.remove('disable-input');
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  End game                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function endGame() {
  gameOver.play();
  gameSound.pause();
  gameSound.currentTime = 0;
  toggleRandomWordDisplay();
  hideRestart();
  disableInput();
  hits = 0;
  count = 99;
}

function hideRestart() {
  restart.classList.add('hidden');
  start.classList.remove('hidden');
}

function disableInput() {
  input.classList.add('disable-input');
  input.blur();
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Restart Game                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function restartGame() {
  gameSound.pause();
  gameSound.currentTime = 0;
  stopCount();
  disableInput();
  startCountdown(() => {
    resetWords();
    guessWord();
    hits = 0;
    hitsDisplay.innerText = hits;
    gameSound.play();
    count = 99;
    startCount();
    input.value = '';
    enableInput();
    input.focus();
  });
  
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Event Listeners                                      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
utils.listen('click', start, startGame);
utils.listen('click', restart, restartGame);




/* Use later */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Score                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let scores = [];
function setScoreObj() {
  let score = hitNum;
  let date = new Date().toDateString();
  let percentage = ((score / originalWords.length) * 100).toFixed(2);

  let scoreObj = new Score(date, score, percentage);

  scores.push(scoreObj);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Date                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function getDate() {
  const options = {
    year: numeric,
    month: short,
    day: 2-digit
  }

  return new Date().toLocaleDateString('en-ca', options);
}