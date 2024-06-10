// Constants for player symbols
const PLAYER_1 = "red";
const PLAYER_2 = "yellow";

// Game state variables
let board = Array(42).fill("");
let currentPlayer = PLAYER_1;

//win conditions
const WINNING_COMBINATIONS = [
  [0, 1, 2, 3],
  [41, 40, 39, 38],
  [7, 8, 9, 10],
  [34, 33, 32, 31],
  [14, 15, 16, 17],
  [27, 26, 25, 24],
  [21, 22, 23, 24],
  [20, 19, 18, 17],
  [28, 29, 30, 31],
  [13, 12, 11, 10],
  [35, 36, 37, 38],
  [6, 5, 4, 3],
  [0, 7, 14, 21],
  [41, 34, 27, 20],
  [1, 8, 15, 22],
  [40, 33, 26, 19],
  [2, 9, 16, 23],
  [39, 32, 25, 18],
  [3, 10, 17, 24],
  [38, 31, 24, 17],
  [4, 11, 18, 25],
  [37, 30, 23, 16],
  [5, 12, 19, 26],
  [36, 29, 22, 15],
  [6, 13, 20, 27],
  [35, 28, 21, 14],
  [0, 8, 16, 24],
  [41, 33, 25, 17],
  [7, 15, 23, 31],
  [34, 26, 18, 10],
  [14, 22, 30, 38],
  [27, 19, 11, 3],
  [35, 29, 23, 17],
  [6, 12, 18, 24],
  [28, 22, 16, 10],
  [13, 19, 25, 31],
  [21, 15, 9, 3],
  [20, 26, 32, 38],
  [36, 30, 24, 18],
  [5, 11, 17, 23],
  [37, 31, 25, 19],
  [4, 10, 16, 22],
  [2, 10, 18, 26],
  [39, 31, 23, 15],
  [1, 9, 17, 25],
  [40, 32, 24, 16],
  [9, 17, 25, 33],
  [8, 16, 24, 32],
  [11, 17, 23, 29],
  [12, 18, 24, 30],
  [1, 2, 3, 4],
  [5, 4, 3, 2],
  [8, 9, 10, 11],
  [12, 11, 10, 9],
  [15, 16, 17, 18],
  [19, 18, 17, 16],
  [22, 23, 24, 25],
  [26, 25, 24, 23],
  [29, 30, 31, 32],
  [33, 32, 31, 30],
  [36, 37, 38, 39],
  [40, 39, 38, 37],
  [7, 14, 21, 28],
  [8, 15, 22, 29],
  [9, 16, 23, 30],
  [10, 17, 24, 31],
  [11, 18, 25, 32],
  [12, 19, 26, 33],
  [13, 20, 27, 34],
];

//2P
let player1_Score = 0;
let player2_Score = 0;
let tieCount = 0;

//1P
let player2VsBotPoint = 0;
let botPoint = 0;
let tieCountVsBot = 0;
let isOnePlayerMode = false;

// DOM elements for displaying scores
const player1_ScoreHtml = document.querySelector("#player1_score");
const player2_ScoreHtml = document.querySelector("#player2_score");
const tieScoreHtml = document.querySelector("#tie_score");

// DOM element for changing mode
const toggle_mode_btn = document.querySelector("#toggle_mode_btn");
  // Toggle between 2P and 1P modes
    toggle_mode_btn.addEventListener('click', () => { 
      isOnePlayerMode = !isOnePlayerMode;
      toggle_mode_btn.textContent = isOnePlayerMode ? '1P' : '2P';
      document.querySelector('#player1_label').textContent = isOnePlayerMode ? 'Bot' : 'Player 1';
      player1_ScoreHtml.textContent = isOnePlayerMode ? botPoint : player1_Score;
      player2_ScoreHtml.textContent = isOnePlayerMode ? player2VsBotPoint : player2_Score;
      tieScoreHtml.textContent = isOnePlayerMode ? tieCountVsBot : tieCount;
      document.querySelectorAll('.board .cell').forEach(cell => cell.style.backgroundColor = '');
      board.fill('');
      if (isOnePlayerMode) bot(); 
    })

// Initializes the game and setups event listeners on cells
function startGame() {
  // Add event listeners to each cell for mouseover, mouseout, and click
  document.querySelectorAll(".coins .cell").forEach((cell, index) => {
    cell.addEventListener("mouseover", () => addHoverAnimation(cell));
    cell.addEventListener("mouseout", () => removerHoverAnimation(cell));
    cell.addEventListener("click", () => handleClick(cell, index));
  });
}

// Function to add hover animation to the cell
function addHoverAnimation(cell) {
  cell.style.backgroundColor = currentPlayer;
}

// Function to remove hover animation from the cell
function removerHoverAnimation(cell) {
  cell.style.backgroundColor = "";
}

// Function to handle click on a cell
function handleClick(cell, index) {
  const spot = deepestSpotCanPlaceFromIndex(index);
  const cellToColor = document.querySelectorAll(".board .cell");

  if (spot !== -1) {
    // Update board state and cell color
    board[spot] = currentPlayer;
    cellToColor[spot].classList.add(currentPlayer);
    cellToColor[spot].style.backgroundColor = currentPlayer;
    // Swap color and player for the next move
    swapColor(cell);
    if (checkWin()) {
      updateScore(currentPlayer);
      setTimeout(resetBoard, 500);
    } else if (checkDraw()) { 
        tieCount += 1;
        tieScoreHtml.textContent = tieCount;
        setTimeout(resetBoard, 500);
    } else { 
        swapPlayer();
        if (isOnePlayerMode && currentPlayer === PLAYER_1) {
          bot();
        }
    }
  }
}

// Function to swap the background color of the cell right befor click
function swapColor(cell) {
  currentColor = currentPlayer;
  cell.style.backgroundColor = currentColor === "red" ? "yellow" : "red";
}

// Function to swap the current player
function swapPlayer() {
  currentPlayer = currentPlayer == PLAYER_1 ? PLAYER_2 : PLAYER_1;
}

// Function to find the deepest spot to place the coin in a column
function deepestSpotCanPlaceFromIndex(index) {
  let col = index % 7;
  for (let row = 5; row >= 0; row--) {
    let spot = row * 7 + col;
    if (board[spot] === "") {
      return spot;
    }
  }
  return -1;
}

// Checks if the current board configuration is a win
function checkWin() {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => board[index] === currentPlayer);
  });
}

// Checks if the game is a draw
function checkDraw() {
  return board.every((cell) => cell !== "");
}

// Resets the board and reinitializes the game
function resetBoard() {
  board.fill("");
  currentPlayer = PLAYER_1;
  document.querySelectorAll(".board .cell").forEach((cell) => (cell.style.backgroundColor = ""));
  if (isOnePlayerMode) bot(); 
}

// Updates the score for the winning player
function updateScore(winner) {
  if (winner === PLAYER_1) {
    player1_Score += 1;
    player1_ScoreHtml.textContent = player1_Score;
  } else {
    player2_Score += 1;
    player2_ScoreHtml.textContent = player2_Score;
  }
}

// Bot player
function bot() { 
  let bestMove = findBestMove();
  board[bestMove] = PLAYER_1 ;
  let cells = document.querySelectorAll('.board .cell');
  cells[bestMove].style.backgroundColor = PLAYER_1;
  if (checkWin()) {
    updateScore(currentPlayer);
    setTimeout(resetBoard, 500);
  } else if (checkDraw()) {
    tieCountVsBot += 1;
    tieScoreHtml.textContent = tieCountVsBot;
    setTimeout(resetBoard, 500);
  } else { 
    currentPlayer = PLAYER_2;
  }
}

function findBestMove() { 
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < board.length; i++) { 
    let spot = deepestSpotCanPlaceFromIndex(i);
    if (spot !== -1) { 
      board[spot] = PLAYER_1;
      let score = miniMax(board, 0, -Infinity, Infinity, false);
      board[spot] = '';
      if (score > bestScore) { 
        bestScore = score;
        bestMove = spot;
      }
    }
  }
  return bestMove;
}

let scores = {
  [PLAYER_1]: 1,
  [PLAYER_2]: -1,
  ' ': 0
};

function miniMax(board, depth, alpha, beta, isMaximizing) {
  if (depth > 4) { 
    return 0;
  }

  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      let spot = deepestSpotCanPlaceFromIndex(i);
      if (spot !== -1) {
        board[spot] = PLAYER_1;
        let score = miniMax(board, depth + 1, alpha, beta ,false);
        board[spot] = '';
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) { 
          break;
        } 
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      let spot = deepestSpotCanPlaceFromIndex(i);
      if (spot !== -1) {
        board[spot] = PLAYER_2;
        let score = miniMax(board, depth + 1, alpha, beta, true);
        board[spot] = '';
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, bestScore);
        if (beta < alpha) { 
          break;
        }
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c, d] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c] && board[c] === board[d]) {
      return board[a];
    }
  }
  if (board.every(cell => cell !== '')) {
    return 'tie';
  }
  return null;
}  

 
// Start the game
startGame();
