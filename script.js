const playerOneScoreElement = document.getElementById('player-one-score');
const playerTwoScoreElement = document.getElementById('player-two-score');
const ropeMarker = document.getElementById('rope-marker');
const questionText = document.getElementById('question-text');
const statusText = document.getElementById('status-text');
const turnLabel = document.getElementById('turn-label');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer-input');
const newQuestionButton = document.getElementById('new-question-btn');
const resetButton = document.getElementById('reset-btn');

let playerOneScore = 0;
let playerTwoScore = 0;
let activePlayer = 1;
let currentAnswer = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildQuestion() {
  const operations = ['+', '-', '*'];
  const operation = operations[randomInt(0, operations.length - 1)];

  let first = randomInt(1, 12);
  let second = randomInt(1, 12);

  if (operation === '-') {
    if (second > first) {
      [first, second] = [second, first];
    }
    currentAnswer = first - second;
  } else if (operation === '*') {
    currentAnswer = first * second;
  } else {
    currentAnswer = first + second;
  }

  questionText.textContent = `${first} ${operation} ${second} = ?`;
  statusText.textContent = '';
}

function updateRopePosition() {
  const difference = playerOneScore - playerTwoScore;
  const maxVisibleShift = 40;
  const shift = Math.max(-maxVisibleShift, Math.min(maxVisibleShift, difference * 8));
  ropeMarker.style.left = `${50 + shift}%`;
}

function refreshView() {
  playerOneScoreElement.textContent = String(playerOneScore);
  playerTwoScoreElement.textContent = String(playerTwoScore);
  turnLabel.textContent = `Ход: Игрок ${activePlayer}`;
  updateRopePosition();
}

function switchTurn() {
  activePlayer = activePlayer === 1 ? 2 : 1;
}

function applyCorrectAnswer() {
  if (activePlayer === 1) {
    playerOneScore += 1;
  } else {
    playerTwoScore += 1;
  }
}

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (currentAnswer === null) {
    statusText.textContent = 'Сначала сгенерируйте вопрос.';
    return;
  }

  const submittedValue = Number(answerInput.value);
  if (Number.isNaN(submittedValue)) {
    statusText.textContent = 'Введите число.';
    return;
  }

  if (submittedValue === currentAnswer) {
    applyCorrectAnswer();
    statusText.textContent = `Верно! Игрок ${activePlayer} получает 1 балл.`;
  } else {
    statusText.textContent = `Неверно. Правильный ответ: ${currentAnswer}.`;
  }

  switchTurn();
  refreshView();
  buildQuestion();
  answerInput.value = '';
  answerInput.focus();
});

newQuestionButton.addEventListener('click', () => {
  buildQuestion();
  answerInput.focus();
});

resetButton.addEventListener('click', () => {
  playerOneScore = 0;
  playerTwoScore = 0;
  activePlayer = 1;
  currentAnswer = null;
  questionText.textContent = 'Нажмите «Новый вопрос», чтобы начать';
  statusText.textContent = 'Игра сброшена.';
  answerInput.value = '';
  refreshView();
});

refreshView();
