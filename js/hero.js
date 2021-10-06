'use strict';

const LASER_SPEED = 100;
var gShootInt;
var gHero;
var gLazerPos;
var gIsBlowUpMode = false;


// creates the hero and place it on board
function createHero(board) {
    gHero = {
        pos: {
            i: 12,
            j: 6
        },
        isShoot: false,
        isSuper: false,
        superCount: 3
    };

    updateCell(gHero.pos, HERO);
    return gHero;
}

// Handle game keys
function onKeyDown(ev) {
    // console.log('ev', ev);
    switch (ev.code) {
        case 'ArrowLeft':
            moveHero(- 1);
            break;
        case 'ArrowRight':
            moveHero(1);
            break;
        case 'Space':
            shoot();
            gHero.isShoot = true;
            break;
        case 'KeyN':
            shoot();
            gHero.isShoot = true;
            gIsBlowUpMode = true;
            break;
        case 'KeyX':
            superMode();
            break;

    }

}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    if (!gGame.isOn) return;

    var i = gHero.pos.i;
    var j = gHero.pos.j;

    if (j + dir < 0 || j + dir > gBoard.length - 1) return;

    updateCell({ i, j }, '');

    j += dir
    gHero.pos.j = j;

    updateCell({ i, j }, HERO);
}


// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (!gGame.isOn) return;
    if (gHero.isShoot) return;
    // if (gHero.isSuper && !gHero.superCount) return;
    var i = gHero.pos.i
    var j = gHero.pos.j;

    gLazerPos = {
        i: i,
        j, j
    }
    var laserSpeed = (gHero.isSuper) ? 30 : LASER_SPEED;

    gShootInt = setInterval(moveLazer, laserSpeed);
}


function moveLazer() {
    gLazerPos.i -= 1
    var nextCell = gBoard[gLazerPos.i][gLazerPos.j];

    if (gIsBlowUpMode) {
        var isAlianHit = blowUpNegs(gLazerPos.i, gLazerPos.j, gBoard);
        if (gLazerPos.i === 0 || isAlianHit) {
            clearInterval(gShootInt);
            gIsBlowUpMode = false;
            gHero.isShoot = false;
        }
    } else if (gLazerPos.i === 0 || nextCell.gameElement === ALIEN
        || nextCell.gameElement === CANDY || nextCell.type === BUNKER) {
        clearInterval(gShootInt);
        gHero.isShoot = false;

        if (gHero.isSuper) gHero.isSuper = false;
        if (nextCell.gameElement === ALIEN) {
            handleAlienHit(gLazerPos);

        } else if (nextCell.gameElement === CANDY) {
            updateScore(50);
            updateCell(gLazerPos, null)
            gIsAlienFreeze = true;
            setTimeout(function () {
                gIsAlienFreeze = false;
            }, 5000);

        } else if (nextCell.type === BUNKER) {
            removeBunker(gLazerPos);
        }

        return;
    }

    blinkLaser(gLazerPos)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    // add LASER
    var lazerShape = (gHero.isSuper) ? '🔸' : LASER;
    updateCell(pos, lazerShape);

    // remove LASER after 2Msec
    setTimeout(function () {
        updateCell(pos, null);
    }, 20);
}


function blowUpNegs(cellI, cellJ, board) {
    var isHit = false;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
          
            if (board[i][j].gameElement === ALIEN) {
                handleAlienHit({ i, j });
                isHit = true;
            
            } else if (board[i][j].type === BUNKER) {
                removeBunker({ i, j });
                isHit = true;
            }
        }
    }
    return isHit;
}


function superMode() {
    if (!gHero.superCount) return;
    gHero.isSuper = true;

    shoot();
    gHero.isShoot = true;

    gHero.superCount--;
}