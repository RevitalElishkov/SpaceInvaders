'use strict';

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = '🐱‍🚀';
const ALIEN = '👽';
const LASER = '⤊';
const GROUND = '🏢';
const SKY = 'sky';
// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard;
var gGame = {
    isOn: false,
    aliensCount: 0,
    score: 0
}


// Called when game loads
function init() {
    gBoard = createBoard();
    renderBoard(gBoard);
    createHero(gBoard);
    gAliensTopRowIdx = 0;
    gAliensBottomRowIdx = 1;
    createAliens(gBoard);
    gGame.isOn = true;
    console.log('gBoard', gBoard);
    gIsAlienFreeze = false;
 
    

}
// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    var board = [];
    for (var i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < BOARD_SIZE; j++) {
            var cell = { type: SKY, gameElement: null };

            // if (i === 0 && j > 2 && j < 11) board[i][j] = ALIEN;
            if (i === BOARD_SIZE - 1) cell.type = GROUND;

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

            if (cell.gameElement === ALIEN) className += ' alien';
            else if (cell.gameElement === HERO) className += ' hero';
            else if (cell.type === GROUND) className += ' ground';
            else if (cell.type === SKY) className += ' sky';

            strHtml += `<td class="${className}"
                data-i="${i}" data-j="${j}">`

            if (cell.gameElement === ALIEN) strHtml += ALIEN;
            else if (cell.gameElement === HERO) strHtml += HERO;
            // else if (cell.gameElement === LASER) strHtml += LASER;

            strHtml += '</td>'
        }
        strHtml += ' </tr>'
    }
    // console.log('strHtml', strHtml)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;


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

function checkGameOver(){
    if(gGame.aliensCount === 0) gameOver(true);
}

function gameOver(isWinner){

    var msg = (isWinner) ? 'WINNER' : 'GAME OVER';
    openModal(msg);
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