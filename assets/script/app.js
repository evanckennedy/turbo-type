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
const hitsDisplay = utils.select('.hits');
const input = utils.select('.user-guess');
const randomWordDisplay = utils.select('.random-word-wrapper p');

const gameSound = new Audio('./assets/media/game-sound.mp3');
const correctAnswer = new Audio('./assets/media/correct-answer.mp3');
const gameOver = new Audio('./assets/media/game-over.mp3');

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
  clearInput();
  startCount();
  gameSound.play();
  input.focus();
  hideStart();
  hitsDisplay.innerText = hits;
  guessWord();
}

function hideStart() {
  start.classList.add('hidden');
  restart.classList.remove('hidden');
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  End game                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function endGame() {
  gameOver.play();
  gameSound.pause();
  gameSound.currentTime = 0;
  hideRestart();
  hits = 0;
  count = 99;
}

function hideRestart() {
  restart.classList.add('hidden');
  start.classList.remove('hidden');
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Restart Game                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function restartGame() {
  resetWords();
  guessWord();
  hits = 0;
  hitsDisplay.innerText = hits;
  count = 99;
  gameSound.currentTime = 0;
  input.focus();
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