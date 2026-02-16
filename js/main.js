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

    gGame.isOn = true

}

function restartGame() {
    onInit()
}


function buildBoard() {
    const size = gLevel.size
    const board = []

    for (let i = 0; i < size; i++) {
        board.push([])

        for (let j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
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
    const currCell = gBoard[i][j]
    if (currCell.isRevealed) return

    currCell.isRevealed = true

    const minesAround = countNeighbors(i, j, gBoard)

    if (currCell.isMine) {
        elCell.innerText = '🧨'
    } else {
        if (minesAround === 0) {
            elCell.innerText = '0'
        } else {
            elCell.innerText = minesAround
        }
    }
    console.log(minesAround)
}





function countNeighbors(rowIdx, colIdx, mat) {
    var neighborsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue

            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
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