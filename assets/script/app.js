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
const leaderboardDisplay = utils.select('.leaderboard-container');
const openLeaderboard = utils.select('.leaderboard-wrapper i');
const closeLeaderboard = utils.select('.close-leaderboard-wrapper i');
const scoresContainer = utils.select('.scores-container');

const gameSound = new Audio('./assets/media/game-sound.mp3');
gameSound.volume = 0.45;
const correctAnswer = new Audio('./assets/media/correct-answer.mp3');
correctAnswer.volume = 0.25;
const gameOver = new Audio('./assets/media/game-over.mp3');
gameOver.volume = 0.6;
const countdown = new Audio('./assets/media/countdown.mp3');
countdown.volume = 0.55;

let count = 10;
let hits = 0;

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Random Words                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let words = [...originalWords];
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
  openLeaderboard.classList.add('disabled');
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
  countdown.currentTime = 0;
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
/*  End game                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function endGame() {
  pushScore(getScore());
  clearInput();
  stopCount();
  gameOver.play();
  gameSound.pause();
  gameSound.currentTime = 0;
  toggleRandomWordDisplay();
  hideRestart();
  disableInput();
  openLeaderboard.classList.remove('disabled');
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
/*  Score                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let highScores = [];

// Call getTopNine when the page loads
getTopNine();

function pushScore(score) {
  highScores.push(score);
  sortScores();
  localStorage.setItem('highScores', JSON.stringify(highScores));
  getTopNine();
}

function getTopNine() {
  // If 'highScores' exists in localStorage, retrieve and parse it into an array
  if (localStorage.getItem('highScores')) {
    highScores = JSON.parse(localStorage.getItem('highScores'));
  }

  while (highScores.length > 9) {
    highScores.pop();
  }

  displayScores();
}

function sortScores() {
  highScores.sort((a, b) => b.hits - a.hits);
}

function getScore() {
  const score = {
    hits: getHits(),
    perc: getPercentage(getHits()),
    date: getDate()
  }

  return score;
}

function getDate() {
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }

  return new Date().toLocaleDateString('en-ca', options);
}

/* function getHits() {
  return hits;
} */

function getHits() {
  return hits < 10 ? String(hits).padStart(2, '0') : String(hits);
}

function getPercentage() {
  return ((hits / originalWords.length) * 100).toFixed(2);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Leaderboard                                          */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function displayScores() {
  scoresContainer.innerHTML = '';

  highScores.forEach((score, index) => {
    let li = document.createElement('li');
    li.classList.add('flex', 'space-between');

    li.innerHTML = 
    `
    <p>#${index + 1}</p>
    <p>${score.hits} hits</p>
    <p>${score.date}</p>
    `;

    scoresContainer.append(li);
  })
}

function showLeaderboard() {
  leaderboardDisplay.classList.remove('display-none');
}

function removeLeaderboard() {
  leaderboardDisplay.classList.add('display-none');
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Event Listeners                                      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
utils.listen('click', start, startGame);
utils.listen('click', restart, restartGame);
utils.listen('click', openLeaderboard, () => {
  if (!openLeaderboard.classList.contains('disabled')) {
    showLeaderboard();
  }
});
utils.listen('click', closeLeaderboard, removeLeaderboard);