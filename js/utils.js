'use strict'

function renderBoard(mat, selector) {
    var strHTML = ''

    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < mat[0].length; j++) {
            const currCell = gBoard[i][j]
            // const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`
            var content = ''

            // content = !currCell.isRevealed ? '' : '1'
            if (currCell.isRevealed && currCell.isMine) {
                content = '🧨'
            }

            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i},${j})">${content}</td>`
        }

        strHTML += '</tr>'
    }

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// function getRandomIntInclusive(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min
// }

