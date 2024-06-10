// DOM references
let board = document.querySelector('.board');
let menu = document.querySelector('.menu');

// Game state variables
let firstFlip = null;

// Initialize the game board and event listeners
function startGame() {
    let cells = document.querySelectorAll('.board .cell');
    cells.forEach((cell) => {
        cell.addEventListener('click', () => flip(cell));
    });
    // Reset the first flipped card state
    firstFlip = null;
}

// Handle the flipping of a card
function flip(cell) {
    if (cell.classList.contains('matched') || cell.classList.contains('flipped')) {
        // If already matched or flipped, do nothing
        return;
    }
    
    // Add flipped class to show the back side
    cell.classList.add('flipped');
    
    if (firstFlip) {
        // If there's already a first flipped card, check for a match
        if (firstFlip !== cell) {
            checkPair(cell);
        }
    } else {
        // Set this card as the first flipped card
        firstFlip = cell;
    }
}
// Check if two flipped cards match
function checkPair(currentCell) {
    if (firstFlip.querySelector('.back').textContent === currentCell.querySelector('.back').textContent) {
        // If the cards match, mark them as matched
        firstFlip.classList.add('matched');
        currentCell.classList.add('matched');
        firstFlip = null; // Reset firstFlip for the next turn
    } else {
        // If not a match, flip them back after 1 second
        setTimeout(() => {
            firstFlip.classList.remove('flipped');
            currentCell.classList.remove('flipped');
            firstFlip = null;
        }, 600);
    }
}

// Add content to the board based on size and shuffle the icons
function addContent(size) {
    let icons = [];
    for (let i = 0; i < size / 2; i++) {
        icons.push(i, i);
    }
    icons.sort(() => Math.random() - 0.5); // Shuffle the icons
    return icons;
}

// Create a single cell with front and back content
function createCell(id, icon) {
    return `<div class="cell" id="cell_${id}">
        <div class="front" id="front-side"></div>
        <div class="back" id="back-side">${icon}</div>
    </div>`;
}

// Setup and display the game board
function setupBoard(size, className) {
    let icons = addContent(size);
    menu.style.display = 'none'; // Hide menu
    board.className = 'board ' + className; // Set class for styling based on difficulty
    const cells = Array.from({ length: size }, (_, i) => createCell(i, icons[i])).join('');
    board.innerHTML = cells; // Populate the board with cells
    startGame(); // Start the game
}

// Display functions for each difficulty level
function showEasyBoard() {
    setupBoard(16, 'board_easy');
}

function showMediumBoard() {
    setupBoard(24, 'board_medium');
}

function showHardBoard() {
    setupBoard(32, 'board_hard');
}
