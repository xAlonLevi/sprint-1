'use strict'

function renderBoard(mat, selector) {
    var strHTML = ''

    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`
            var content = ''

            content = !gBoard[i][j].isRevealed ? 'N' : 'O'
            if (gBoard[i][j].isRevealed && gBoard[i][j].isMine) {
                content = 'B'
            }

            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i},${j})">${content}</td>`
        }

        strHTML += '</tr>'
    }

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


