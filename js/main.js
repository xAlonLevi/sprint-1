'use strict'

const WALL = '&#8251;'

var gBoard

var gLevel = {
    size: 4,
    mines: 2
}

//game state, stats
var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard() //holds a board with 2 mines

    renderBoard(gBoard, '.board')

}

function buildBoard() {
    const size = 4
    const board = []

    for (let i = 0; i < size; i++) {
        board.push([])

        for (let j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
            if (i === 1 && j === 1 ||
                i === 2 && j === 2) {
                board[i][j].isMine = true
            }
        }
    }
    return board
}


function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.isRevealed) return

    cell.isRevealed = true
    elCell.innerText = cell.isMine ? 'B' : 'O'
}











function setMinesNegsCount(board) {

}

function onCellMarked(elcell, i, j) {

}
function checkGameOver() {

}

//reveals non-mine negs
function expandReveal(board, elcell, i, j) {

}