'use strict';

// This app requires a server to handle import statements
// and CORS issues
import * as utils from './utils.js';
import Score from './Score.js';
import originalWords from './words.js';
console.log(originalWords);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Selectors, Declaration                               */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const start = utils.select('.start');
const restart = utils.select('.restart');
const timeRemaining = utils.select('.time-remaining');
const hits = utils.select('.hits');
const input = utils.select('.user-guess');

const gameSound = new Audio('./assets/media/game-sound.mp3');
const correctAnswer = new Audio('./assets/media/correct-answer.mp3');

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Random Words                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let words = [...originalWords];

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
let count = 100;
let intervalID = null;

function oneSecond() {
  return 1000;
}

function startCount() {
  intervalID = setInterval(() => {
    count --;
    timeRemaining.textContent = count;

    if (count <= 0) {
      clearInterval(intervalID);
    }
  }, oneSecond());
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Start Game                                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function hideStart() {
  start.classList.add('hidden');
  restart.classList.remove('hidden');
}

function hideRestart() {
  restart.classList.add('hidden');
  start.classList.remove('hidden')
}

function startGame() {
  startCount();
  gameSound.play();
  input.focus();
  hideStart();
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Restart Game                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function restartGame() {
  resetWords();
  count = 100;
  gameSound.currentTime = 0;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Event Listeners                                      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
utils.listen('click', start, startGame);
utils.listen('click', restart, restartGame);
utils.listen('input', document, )



/* Use later */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Score                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let scores = [];
function setScoreObj() {
  let score = hitNum;
  let date = new Date().toDateString();
  let percentage = ((score / words.length) * 100).toFixed(1);

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