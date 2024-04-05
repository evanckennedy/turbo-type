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
gameSound.volume = 0.45;
const correctAnswer = new Audio('./assets/media/correct-answer.mp3');
correctAnswer.volume = 0.25;
const gameOver = new Audio('./assets/media/game-over.mp3');
gameOver.volume = 0.6;
const countdown = new Audio('./assets/media/countdown.mp3');
countdown.volume = 0.55;

let count = 10;

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
  let userInput = input.value.toLowerCase().trim();
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
  if (words.length === 0) {
    endGame();
    return;
  }

  let index = Math.floor(Math.random() * words.length);
  let word = words[index];
  words.splice(index, 1);
  return word;
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
  count = 10;
  hits = 0;
  timeRemaining.innerText = count;
  hitsDisplay.innerText = '0';
  start.classList.add('hidden');
  resetWords();
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
  setScoreObj();
  clearInput();
  stopCount();
  gameOver.play();
  gameSound.pause();
  gameSound.currentTime = 0;
  toggleRandomWordDisplay();
  hideRestart();
  disableInput();
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
  count = 10;
  timeRemaining.innerText = count;
  hitsDisplay.innerText = '0';
  restart.classList.add('hidden')
  gameSound.pause();
  gameSound.currentTime = 0;
  stopCount();
  disableInput();
  startCountdown(() => {
    restart.classList.remove('hidden');
    resetWords();
    guessWord();
    hits = 0;
    hitsDisplay.innerText = hits;
    gameSound.play();
    startCount();
    input.value = '';
    enableInput();
    input.focus();
  });
}

function resetWords() {
  words = [...originalWords];
  }
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Event Listeners                                      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
utils.listen('click', start, startGame);
utils.listen('click', restart, restartGame);



/* Get Score */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Score                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let scores = [];
function setScoreObj() {
  let score = hitsDisplay.innerText;
  let date = getDate();
  let percentage = ((score / originalWords.length) * 100).toFixed(2);

  let scoreObj = new Score(date, score, percentage);

  scores.push(scoreObj);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Date                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function getDate() {
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }

  return new Date().toLocaleDateString('en-ca', options);
}