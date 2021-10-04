'use strict';

const ALIEN_SPEED = 500;
var gIntervalAliens;
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx;
var gAliensBottomRowIdx;
var gIsAlienFreeze = true;
var gAliens = [];


function createAliens(board) {
    for (var i = gAliensTopRowIdx; i < gAliensBottomRowIdx; i++) {
        // var num = 12;
        for (let j = 0; j < 8; j++) {
            // updateCell({ i, end }, ALIEN);
            board[i][j].gameElement = ALIEN;
            var elCell = getElCell({ i, j });

            elCell.innerText = ALIEN;
            gGame.aliensCount++;

            var alienPos = {
                i: i,
                j: j
            }
            gAliens.push(alienPos);
            // num--;
        }
    }
    // console.log('gAliens', gAliens);
}


function handleAlienHit(pos) {
    console.log('alienHit');
    // removing ALIEN from the board
    for (var i = 0; i < gAliens.length; i++) {
        if (gAliens[i].i === pos.i && gAliens[i].j === pos.j)
        
            gAliens.splice(i, 1);
            // console.log(' gAliens', gAliens);
    }
    updateCell(pos);
    updateScore(10);
    gGame.aliensCount--;

    checkGameOver()
}


function shiftBoardRight(board, fromI, toI) {
    for (var idx = fromI; idx < toI; idx++) {
        for (var idx2 = 0; idx2 <= 8; idx2++) {
            if (board[idx][idx2].gameElement === ALIEN)
                board[idx][idx2].gameElement = null;
        }

    }

    for (var i = 0; i < gAliens.length; i++) {
        // console.log('gAliens[i]', gAliens[i]);
        // var posI = gAliens[i].i
        // var posj = gAliens[i].j
        // gBoard[gAliens[i].i][gAliens[i].j].gameElement = null;

        gAliens[i].j += 1;
        if (board[gAliens[i].i][gAliens[i].j].gameElement === LASER) {
            console.log('laser');
        }
        board[gAliens[i].i][gAliens[i].j].gameElement = ALIEN;

    }
    console.log('gAliens', gAliens);
    renderBoard(gBoard);
    // for (var i = fromI; i < toI; i++) {
    //     for (var j = 0; j < array.length; j++) {


    //     }

    // }
}
function shiftBoardLeft(board, fromI, toI) {
    // for (var idx = fromI; idx < toI; idx++) {
    //     for (var idx2 = 0; idx2 <= 8; idx2++) {
    //         if (board[idx][idx2].gameElement === ALIEN)
    //             board[idx][idx2].gameElement = null;
    //     }

    // }

    // console.log('gAliens', gAliens);
    // for (var i = 0; i < gAliens.length; i++) {
    //     console.log('gAliens[i]', gAliens[i]);
    //     var posI = gAliens[i].i
    //     var posj = gAliens[i].j
    //     // gBoard[gAliens[i].i][gAliens[i].j].gameElement = null;

    //     gAliens[i].j -= 1;
    //     board[gAliens[i].i][gAliens[i].j].gameElement = ALIEN;

    // }
    // console.log('gAliens[i]', gAliens);
    // renderBoard(gBoard);

}
function shiftBoardDown(board, fromI, toI) { }
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    if (gIsAlienFreeze) return;





    // console.log('gBoard', gBoard);
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