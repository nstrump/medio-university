'use strict';

const eighthNote = '\u{1F3B5}';

//these are for sure different
const bingoCellsCardOne = document.querySelectorAll('#card-one .bingo-card__cell');
const bingoCellsCardTwo = document.querySelectorAll('#card-two .bingo-card__cell');
const winnerMsg = document.querySelector('#winner-msg');

const scales = [
    'C', 'G', 'D', 'A', 'E', 'F',
    'Am', 'Em', 'Bm', 'F#m', 'C#m', 'Dm', 'FREE',
    `C w/ ${eighthNote}`, `G w/ ${eighthNote}`, `D w/ ${eighthNote}`, `A w/ ${eighthNote}`, `E w/ ${eighthNote}`, `F w/ ${eighthNote}`,
    `Am w/ ${eighthNote}`, `Em w/ ${eighthNote}`, `Bm w/ ${eighthNote}`, `F#m w/ ${eighthNote}`, `C#m w/ ${eighthNote}`, `Dm w/ ${eighthNote}`
];

let scalesArray = Array.from(scales);
let gameActive = true;
let currScale;

const bingoMsg = state => state === gameStatePlayerOne ? winnerMsg.textContent = `P1 won!` : winnerMsg.textContent = 'P2 won!';

const winCombos = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9], 
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0,5,10,15,20],
    [1,6,11,16,21],
    [2,7,12,17,22],
    [3,8,13,18,23],
    [4,9,14,19,24],
    [0,6,12,18,24],
    [20,16,12,8,4]
];

const gameStatePlayerOne = [
    false, false, false, false, false,
    false, false, false, false, false,
    false, false, false, false, false,
    false, false, false, false, false,
    false, false, false, false, false
];

const gameStatePlayerTwo = [
    false, false, false, false, false,
    false, false, false, false, false,
    false, false, false, false, false,
    false, false, false, false, false,
    false, false, false, false, false
];

document.getElementById('btn-call').addEventListener('click', bingoCallHandler);
document.getElementById('btn-reset').addEventListener('click', function() {


    if (confirm("Are you sure you want to start a new game?")) {
        for (let i = 0; i < gameStatePlayerOne.length; i++) {
            gameStatePlayerOne[i] = false;
            gameStatePlayerTwo[i] = false;
        }
        
        shuffledScalesCardOne = shuffle(shuffledScalesCardOne);
        shuffledScalesCardTwo = shuffle(shuffledScalesCardTwo);
        fillCardCells(bingoCellsCardOne, shuffledScalesCardOne);
        fillCardCells(bingoCellsCardTwo, shuffledScalesCardTwo); 
        winnerMsg.textContent = '';
        document.querySelector('.bingo-call').textContent = '';
        gameActive = true;   
    }
});


const randomElement = array => array[Math.floor(Math.random() * array.length)];

function shuffle(array) {
    let randomArray = [...array];
    let currentIndex = randomArray.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      
        currentIndex -= 1;

        if (currentIndex === 12 || randomIndex === 12) {
            continue;
        }
        // And swap it with the current element.
            temporaryValue = randomArray[currentIndex]; 
            randomArray[currentIndex] = randomArray[randomIndex]; 
            randomArray[randomIndex] = temporaryValue; 
    }
    return randomArray;
}

let shuffledScalesCardOne = shuffle(scales);
let shuffledScalesCardTwo = shuffle(scales);

function fillCardCells(card, scale) {
    for (const cell of card) {
        let cellNum = Number(cell.getAttribute('data-cell-index'));
        cell.textContent = scale[cellNum];
    }
}

fillCardCells(bingoCellsCardOne, shuffledScalesCardOne);
fillCardCells(bingoCellsCardTwo, shuffledScalesCardTwo);

bingoCellsCardOne.forEach(cell => cell.addEventListener('click', function(e) {chipHandler(e, gameStatePlayerOne, shuffledScalesCardOne)}));
bingoCellsCardTwo.forEach(cell => cell.addEventListener('click', function(e) {chipHandler(e, gameStatePlayerTwo, shuffledScalesCardTwo)}));

function bingoCallHandler() {
    if (scalesArray.length === 1) {
        scalesArray =  [...scales];
    }
    const findRandomScale = function() {
        const randomNum = Math.floor(Math.random() * scalesArray.length);
        let currScale = scalesArray[randomNum];
    
        if (currScale === 'FREE') {
            scalesArray.splice(randomNum, 1)
            findRandomScale();
        } else {
            document.querySelector('.bingo-call').textContent = currScale;
            scalesArray.splice(randomNum, 1);    
        }
    }
    findRandomScale();
}

const chipHandler = function(e, state, scale) {
    if (gameActive) {
        if (e.currentTarget.innerHTML != '<div class="bingo-chip"></div>') {
            e.currentTarget.innerHTML = `<div class="bingo-chip"></div>`;
            let currCellNum = e.currentTarget.getAttribute('data-cell-index');
            state[currCellNum] = true;
            checkGameStatus(state);
        } else {
            let currCellNum = e.currentTarget.getAttribute('data-cell-index');
            let currCellContent = scale[Number(currCellNum)];
            e.currentTarget.innerHTML = currCellContent;
            state[currCellNum] = false;
        }
    }
}

function checkGameStatus(state) {
    for (let i = 0; i < winCombos.length; i++) {
        let count = 0;
        for (let n = 0; n < winCombos[i].length; n++) {
            let currIdx = winCombos[i][n];
            if (state[currIdx] === true) count++;
            if (count === 5) {
                gameActive = false;
                bingoMsg(state);
                break;
            }
        }
        count = 0;
    }
}