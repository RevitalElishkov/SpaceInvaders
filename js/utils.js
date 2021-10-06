'use strict';

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
// function createCell(gameObject = null) {
//     return {
//         type: SKY,
//         gameObject: gameObject
//     }
// }

function getElCell(pos) {
    // console.log('pos', pos);
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`);
}

function drawNum(items) {
    var idx = getRandomInt(0, items.length - 1)
    var num = items[idx]
    items.splice(idx, 1)
    return num
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive 
}