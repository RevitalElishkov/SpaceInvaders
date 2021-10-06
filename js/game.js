'use strict';

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = `<div class="hero">🐱‍🚀</div>`;
const ALIEN = `<div class="alien floating">👽</div>`;
const LASER = '⤊';
const GROUND = '🏢';
const SKY = 'sky';
const EMPTHY = 'empthy'
const CANDY = '🍬';
const BUNKER = 'bunker';
// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard;
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0,
    lives: 3
}
var gCandyInt;

// Called when game loads
function init() {
    gBoard = createBoard();
    renderBoard(gBoard);
    createHero(gBoard);
    createAliens(gBoard);
    // console.log('gBoard', gBoard);
}

function startGame() {
    gIsAlienFreeze = false;
    gAliensTopRowIdx = 0;
    gAliensBottomRowIdx = 3;
    gGame.aliensCount = 0;
    gGame.score = 0;
    updateScore(0);
    gGame.lives = 3;
    gGame.isOn = true;
    closeModal();
    init();

    gIntervalAliens = setInterval(moveAliens, 1000);
    gCandyInt = setInterval(AddCandy, 10000);
    gAlianlazerInt = setInterval(alienShoot, 3000)
    var elLives = document.querySelector('.lives')
    elLives.innerText = '💖' + gGame.lives;

}
// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    var board = [];
    for (var i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < BOARD_SIZE; j++) {
            var cell = { type: SKY, gameElement: null };

            if (i === BOARD_SIZE - 1) cell.type = GROUND;
            if ((i === BOARD_SIZE - 3 && j > 1 && j < 5) ||
                (i === BOARD_SIZE - 3 && j > 8 && j < BOARD_SIZE - 2)) cell.type = BUNKER;

            board[i][j] = cell;
        }
    }
    return board;
}


// Render the board as a <table> to the page
function renderBoard(board) {
    // console.table(board);
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = 'cell';

            if (cell.type === GROUND) className += ' ground';
            else if (cell.type === BUNKER) className += ' bunker';
            else if (cell.type === SKY) className += ' sky';


            strHtml += `<td class="${className}"
                data-i="${i}" data-j="${j}">`

            if (cell.gameElement === ALIEN) strHtml += ALIEN;
            else if (cell.gameElement === HERO) strHtml += HERO;
            else if (cell.gameElement === CANDY) strHtml += CANDY;

            strHtml += '</td>'
        }
        strHtml += ' </tr>'
    }
    // console.log('strHtml', strHtml)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;


}


function AddCandy() {
    var candyPos = getEmpthyCell(gBoard);
    updateCell(candyPos, CANDY);
    setTimeout(function () {
        updateCell(candyPos, null);
    }, 5000);
}


function removeBunker(pos){
    gBoard[pos.i][pos.j].type = SKY;
    var elSky = getElCell(pos);
    elSky.classList.remove('bunker');
    elSky.classList.add('sky');
}


// position such as: {i: 2, j: 7}
function updateCell(pos, gameElement = null) {
    gBoard[pos.i][pos.j].gameElement = gameElement;
    var elCell = getElCell(pos);
    elCell.innerHTML = gameElement || '';
}


function updateScore(diff) {
    gGame.score += diff;
    document.querySelector('.score').innerText = gGame.score
}


function checkGameOver() {
    if (gGame.aliensCount === 0) gameOver(true);
}


function gameOver(isWinner) {

    var msg = (isWinner) ? '✨ WINNER ✨' : '⚡ GAME OVER ⚡';
    openModal(msg);

    clearInterval(gIntervalAliens);
    clearInterval(gCandyInt);
    clearInterval(gAlianlazerInt);
    clearInterval(gAlianShotInt);
  
    gGame.isOn = false;
}


function openModal(strMsg) {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';

    var elMsg = document.querySelector('.msg');
    elMsg.innerText = strMsg;
}


function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
}


function getEmpthyCell(board) {
    var empthyCells = [];
    var i = 0
    for (var j = 0; j < board.length; j++) {
        var currCellPos = { i, j };
        if (!board[i][j].gameElement) empthyCells.push(currCellPos);
    }
    var randCell = drawNum(empthyCells)
    return randCell;
}