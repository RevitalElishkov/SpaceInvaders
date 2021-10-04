'use strict';

const LASER_SPEED = 80;
var gShootInt;
var gHero = {
    pos: {
        i: 12,
        j: 6
    },
    isShoot: false
};
var gLazerPos;


// creates the hero and place it on board
function createHero(board) {
    board[gHero.pos.i][gHero.pos.j].gameElement = HERO;
    var elCell = getElCell(gHero.pos);
    elCell.innerText = HERO;
    // updateCell(gHero.pos, HERO);
}
// Handle game keys
function onKeyDown(ev) {

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
    if (gHero.isShoot) return;
    var i = gHero.pos.i
    var j = gHero.pos.j;

    gLazerPos = {
        i: i,
        j, j
    }

    gShootInt = setInterval(function () {
        moveLazer();
    }, LASER_SPEED);
}


function moveLazer() {
    gLazerPos.i -= 1
    var nextCell = gBoard[gLazerPos.i][gLazerPos.j];

    if (gLazerPos.i === 0 || nextCell.gameElement === ALIEN) {
        clearInterval(gShootInt);
        gHero.isShoot = false;
        if (nextCell.gameElement === ALIEN) handleAlienHit(gLazerPos);
        return;
    }

    blinkLaser(gLazerPos)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    // add LASER
    updateCell(pos, LASER);

    // remove LASER after 1sec
    setTimeout(function () {
        updateCell(pos, '');
    }, 50);
}