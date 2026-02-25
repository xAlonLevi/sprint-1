'use strict'

var gBoard

var gLevel = {
    size: 4,
    mines: 4
}

var gGame = {
    isFirstClick: true,
    isOn: true,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
}

var gLivesLeft

function onInit() {
    gBoard = buildBoard() //holds a board with 2 mines
    setNegsMineCount()
    renderBoard()

    gGame = {
        isFirstClick: true,
        isOn: true,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3
    }

    document.querySelector('.lose-state').classList.remove('show')
    document.querySelector('.win-state').classList.remove('show')
    document.querySelector('.btn').textContent = '😊'

    // addRightClickListener()

}

function renderBoard() {
    var strHTML = ''

    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            // const cell = mat[i][j]
            var className = `cell cell-${i}-${j}`
            var content = ''
            if (currCell.isRevealed) {
                className += ' revealed'
            }
            // content = !currCell.isRevealed ? '' : '1'
            if (currCell.isRevealed && currCell.isMine) {
                content = '🧨'
            }
            else if (currCell.isRevealed && currCell.minesAroundCount) {
                content = currCell.minesAroundCount
            }

            if (currCell.isMarked) {
                content = '🚩'
            }
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i},${j})" oncontextmenu="onCellRightClick(event, this, ${i},${j})">${content}</td>`
        }

        strHTML += '</tr>'
    }

    const elContainer = document.querySelector('.board')

    elContainer.innerHTML = strHTML
}



function onCellRightClick(ev, elCell, i, j) {

    ev.preventDefault()
    if (!gGame.isOn) return
    if (gBoard[i][j].isRevealed) return
    console.log('FLAG TOGGLED', i, j,)

    if (!elCell) return

    const cell = gBoard[i][j]
    if (cell.isRevealed) return

    cell.isMarked = !cell.isMarked

    var gameState = checkGameOver(gBoard, gLevel)
    endState(gameState)
    renderBoard()
    console.log(gBoard[i][j]);

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
                isMarked: false,

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

function setNegsMineCount() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].minesAroundCount = countNeighbors(i, j, gBoard)

        }

    }
}

function onCellClicked(elCell, i, j) {
    if (gGame.isFirstClick) {
        gGame.isOn = true
        gGame.isFirstClick = false
    }
    if (!gGame.isOn) return
    const currCell = gBoard[i][j]

    if (currCell.isRevealed) return

    expandReveal(i, j, gBoard)
    handleMine(i, j)
    var gameState = checkGameOver(gBoard, gLevel)
    endState(gameState)

    renderBoard()
    console.log(currCell);

}

function handleMine(i, j) {
    var cell = gBoard[i][j]

    if (!cell.isMine) return
    cell.isRevealed = true


}


function expandReveal(rowIdx, colIdx, mat) {
    var cell = mat[rowIdx][colIdx]

    if (cell.isMarked || cell.isRevealed || cell.isMine) return
    cell.isRevealed = true

    if (cell.minesAroundCount) return

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            expandReveal(i, j, gBoard)

        }
    }

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

function endState(gameState) {
    document.querySelector('.lives-left').textContent = gameState.livesLeft
    if (gameState.status === 'lose') {
        document.querySelector('.lose-state').classList.add('show')
        document.querySelector('.btn').textContent = '💀'
        document.querySelector('.lives-left').textContent = gameState.livesLeft

    }
    if (gameState.status === 'victory') {
        document.querySelector('.win-state').classList.add('show')
        document.querySelector('.btn').textContent = '😚'
        document.querySelector('.lives-left').textContent = gameState.livesLeft
    }
    return
}

function checkGameOver() {
    var minesRevealedCount = 0
    var cellRevealedCount = 0
    var MinesRevealedWithLife = 0
    var hasLife = true

    for (let i = 0; i < gLevel.size; i++) {
        for (let j = 0; j < gLevel.size; j++) {
            const cell = gBoard[i][j]


            if (cell.isMine && cell.isRevealed) minesRevealedCount++

            if (cell.isRevealed && !cell.isMine) cellRevealedCount++

            var livesLeft = gGame.lives - minesRevealedCount
            // console.log(livesLeft);

            if (cell.isMine && cell.isRevealed && hasLife) MinesRevealedWithLife++
            // console.log(MinesRevealedWithLife);


        }
    }
    if (livesLeft < 1) {
        gGame.isOn = false
        return { status: 'lose', livesLeft }
    }
    const cells = gLevel.size ** 2
    const safeCells = cells - gLevel.mines

    if (cellRevealedCount === safeCells && getMinesFlagCheck()) {

        console.log('victory');
        gGame.isOn = false
        return { status: 'victory', livesLeft }

    }
    return { status: 'playing', livesLeft }
}


// for (let i = 0; i < livesLeft; i++) {
//     for (let j = 0; j < livesLeft; j++) {
//         console.log('h');
//         if (gBoard[i][j].isRevealed && gBoard[i][j].isMine) {
//             gBoard[i][j].isMarked = true
//         }



//     }
//     // gBoard[i][j].isMarked = true

// }


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

    var revealedMinesCount = 0
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine && cell.isRevealed) revealedMinesCount++
        }
    }

    var minesLeftToFlag = gLevel.mines - revealedMinesCount

    return (
        correctlyPlacedFlagCount === minesLeftToFlag &&
        placedFlagCount === minesLeftToFlag
    )
}

// function getMinesFlagCheck() {
//     var placedFlagCount = 0
//     var correctlyPlacedFlagCount = 0

//     for (let i = 0; i < gBoard.length; i++) {
//         for (let j = 0; j < gBoard[0].length; j++) {
//             const cell = gBoard[i][j]

//             if (cell.isMarked) placedFlagCount++
//             if (cell.isMine && cell.isMarked) correctlyPlacedFlagCount++

//         }
//     }

//     console.log(gLevel.mines)
//     return (
//         correctlyPlacedFlagCount === gLevel.mines &&
//         placedFlagCount === gLevel.mines
//     )
// }


function getRandMinePos() {
    // var minesArray = []

    // for (let i = 0; i < gLevel.mines; i++) {
    //     var randMinePoss = {}

    //     var rowIdx = getRandomInt(0, gLevel.size)
    //     var colIdx = getRandomInt(0, gLevel.size)

    //     randMinePoss = { rowIdx, colIdx }
    //     minesArray.push(randMinePoss)
    // }
    // return minesArray

    var minesArray = []

    while (minesArray.length < gLevel.mines) {
        var rowIdx = getRandomInt(0, gLevel.size)
        var colIdx = getRandomInt(0, gLevel.size)

        var mineExists = false
        for (var i = 0; i < minesArray.length; i++) {
            var el = minesArray[i]
            if (el.rowIdx === rowIdx && el.colIdx === colIdx) {
                mineExists = true
                break
            }
        }
        if (mineExists) continue
        minesArray.push({ rowIdx, colIdx })
    }
    return minesArray
}

function changeDiffEasy() {
    gLevel.size = 4
    gLevel.mines = 4
    onInit()

}

function changeDiffMed() {
    gLevel.size = 8
    gLevel.mines = 10
    onInit()

}

function changeDiffHard() {
    gLevel.size = 16
    gLevel.mines = 40
    onInit()

}

