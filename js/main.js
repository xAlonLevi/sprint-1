'use strict'

var gBoard

var gLevel = {
    size: 6,
    mines: 4
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

    document.querySelector('.lose-state').classList.remove('show')
    document.querySelector('.win-state').classList.remove('show')
    document.querySelector('.btn').textContent = '😊'

    addRightClickListener()

}


function addRightClickListener() {
    const elTable = document.querySelector('.board')
    elTable.addEventListener('contextmenu', onCellRightClick)
}

function onCellRightClick(ev) {
    const elCell = ev.target.closest('td')
    if (!elCell) return
    ev.preventDefault()

    const i = elCell.parentElement.sectionRowIndex  // ✅ use this
    const j = elCell.cellIndex

    const cell = gBoard[i][j]
    if (cell.isRevealed) return

    cell.isMarked = !cell.isMarked
    elCell.textContent = cell.isMarked ? '🚩' : ''
    console.log('FLAG TOGGLED', i, j, 'isMarked:', cell.isMarked)

   var gameState = checkGameOver(gBoard, gLevel)
    endState(gameState)
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
        }
    }
    var randMinePossArray = getRandMinePos()

    for (let i = 0; i < randMinePossArray.length; i++) {

        const pos = randMinePossArray[i]
        board[pos.rowIdx][pos.colIdx].isMine = true

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
    var gameState = checkGameOver(gBoard, gLevel)
    endState(gameState)

}

function endState(gameState) {
    if (gameState === 'loss') {
        document.querySelector('.lose-state').classList.add('show')
        document.querySelector('.btn').textContent = '💀'
    }
    if (gameState === 'victory') {
        document.querySelector('.win-state').classList.add('show')
        document.querySelector('.btn').textContent = '😚'
    }
    return
}

function checkGameOver() {
    var minesRevealedCount = 0
    var cellRevealedCount = 0

    for (let i = 0; i < gLevel.size; i++) {
        for (let j = 0; j < gLevel.size; j++) {
            const cell = gBoard[i][j]

            if (cell.isMine && cell.isRevealed) {
                minesRevealedCount++
                console.log(minesRevealedCount)
            }
            if (cell.isRevealed && !cell.isMine) cellRevealedCount++

            if (minesRevealedCount > 0) return 'loss'

        }

    }
    const cells = gLevel.size ** 2
    const safeCells = cells - gLevel.mines
    console.log('safeRevealedCount:', cellRevealedCount, 'safeCells:', safeCells)
    console.log('flags ok:', getMinesFlagCheck())
    if (cellRevealedCount === safeCells && getMinesFlagCheck()) {
        return 'victory'
    }
}

function getMinesFlagCheck() {
    var placedFlagCount = 0
    var correctlyPlacedFlagCount = 0

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]

            if (cell.isMarked) placedFlagCount++
            if (cell.isMine && cell.isMarked) correctlyPlacedFlagCount++

        }
    }
    console.log('placed:', placedFlagCount, 'correct:', correctlyPlacedFlagCount, 'mines:', gLevel.mines)
    return correctlyPlacedFlagCount === gLevel.mines &&
        placedFlagCount === gLevel.mines
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

function getRandMinePos() {
    var minesArray = []

    for (let i = 0; i < gLevel.mines; i++) {
        var randMinePoss = {}

        var rowIdx = getRandomInt(0, gLevel.size)
        var colIdx = getRandomInt(0, gLevel.size)

        randMinePoss = { rowIdx, colIdx }
        minesArray.push(randMinePoss)
    }
    return minesArray
}


