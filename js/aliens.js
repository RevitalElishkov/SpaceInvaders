'use strict';

const ALIEN_SPEED = 500;
var gIntervalAliens;
var gAlianlazerInt;
var gAlianShotInt;
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx;
var gAliensBottomRowIdx;
var gIsAlienFreeze = true;
var gIsDirRight;


function createAliens(board) {
    for (var i = 0; i < 3; i++) {

        for (var j = 3; j < ALIENS_ROW_LENGTH + 3; j++) {

            board[i][j].gameElement = ALIEN;
            var elCell = getElCell({ i, j });

            elCell.innerHTML = ALIEN;
            gGame.aliensCount++;

        }
    }

}


function handleAlienHit(pos) {
    // console.log('alienHit');

    updateCell(pos, null);
    updateScore(10);
    gGame.aliensCount--;

    checkGameOver()
}


function shiftBoardRight(board, fromI, toI) {
    if (gIsAlienFreeze) return;

    for (var i = fromI; i < toI; i++) {
        for (var j = board[0].length - 1; j > -1; j--) {
            if (j < board.length - 1 && board[i][j + 1].gameElement === LASER) {
                var nextj = j + 1
                handleAlienHit({ i, nextj })
                continue;
            }
            if (board[i][j].gameElement === ALIEN) {
                board[i][j + 1].gameElement = ALIEN
                board[i][j].gameElement = null;
            }
        }
    }
}


function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = 0; j < board[i].length - 1; j++) {
            if (j > 0 && board[i][j - 1].gameElement === LASER) {
                var nextJ = j - 1;
                handleAlienHit({ i, nextJ })
                continue;
            }
            if (board[i][j].gameElement === ALIEN) {
                board[i][j - 1].gameElement = ALIEN
                board[i][j].gameElement = null;
            }
        }

    }
}


function shiftBoardDown(board, fromI, toI) {

    for (var i = fromI; i >= toI; i--) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i + 1][j].gameElement === LASER) {
                var nextI = i + 1;
                handleAlienHit({ i, nextI })
                continue;
            }
            if (board[i][j].gameElement === ALIEN) {
                board[i + 1][j].gameElement = ALIEN
                board[i][j].gameElement = null;
            }
        }
    }
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops

var moveDir = 'right';
function moveAliens() {
    if (!gGame.isOn) return;
    if (gIsAlienFreeze) return;
    if (gAliensBottomRowIdx === gBoard.length - 1) {
        gameOver(false);
        return;
    }

    for (var i = gAliensTopRowIdx; i < gAliensBottomRowIdx; i++) {
        if (gBoard[i][gBoard.length - 2].gameElement === ALIEN) {
            // console.log('true- move Left');
            shiftBoardDown(gBoard, gAliensBottomRowIdx, gAliensTopRowIdx)
            moveDir = 'left';
            gAliensBottomRowIdx += 1
            gAliensTopRowIdx += 1
            break;
        }
        if (gBoard[i][0].gameElement === ALIEN) {
            // console.log('true- move right');
            shiftBoardDown(gBoard, gAliensBottomRowIdx, gAliensTopRowIdx)
            moveDir = 'right';
            gAliensBottomRowIdx += 1
            gAliensTopRowIdx += 1
            break;
        }
    }

    if (moveDir === 'right') shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
    else if (moveDir === 'left') shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);

    renderBoard(gBoard);

}


function freezeAlians(elBtn) {
    if (!gIsAlienFreeze) {
        gIsAlienFreeze = true;
        elBtn.innerText = 'Move Aliens';
    } else {
        gIsAlienFreeze = false;
        elBtn.innerText = 'Freeze Alians';
    }
}


var alianLazerPos;
function alienShoot() {

    if (gAliensBottomRowIdx === gBoard.length - 3) {
        clearInterval(gAlianlazerInt);
        return;
    }
    var alienRandPos = getAlienCell(gBoard);

    alianLazerPos = {
        i: gAliensBottomRowIdx,
        j: alienRandPos.j
    }

    gAlianShotInt = setInterval(moveAlienLazer, LASER_SPEED);

}


function moveAlienLazer() {
    alianLazerPos.i++;
    var nextCell = gBoard[alianLazerPos.i][alianLazerPos.j];

    if (alianLazerPos.i === gBoard.length - 2 || nextCell.gameElement === HERO
        || nextCell.type === BUNKER) {

        clearInterval(gAlianShotInt);

        if (nextCell.gameElement === HERO) {
            (!gGame.lives) ? gameOver(false) : gGame.lives--;

            var elLives = document.querySelector('.lives');
            elLives.innerText = '💖' + gGame.lives;

            var elHero = document.querySelector(`.hero`);
            elHero.classList.add('flash');

            setTimeout(function () {
                elHero.classList.remove('flash');
            }, 2000)

        } else if (nextCell.type === BUNKER) {
            removeBunker(alianLazerPos);
        }
       
        return;
    }

    blinkAlianLaser(alianLazerPos);
}


function blinkAlianLaser(pos) {
    // add LASER
    updateCell(pos, '⚡');

    // remove LASER after 2Msec
    setTimeout(function () {
        updateCell(pos, null);
    }, 40);
}


function getAlienCell(board) {
    var AliensCells = [];

    for (var i = gAliensTopRowIdx; i < gAliensBottomRowIdx; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCellPos = { i, j };
            if (board[i][j].gameElement === ALIEN) AliensCells.push(currCellPos);
        }
    }
    var randCell = drawNum(AliensCells)
    return randCell;
}