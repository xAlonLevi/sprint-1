'use strict'

function renderBoard(mat, selector) {
    var strHTML = ''
    
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        
        for (var j = 0; j < mat[0].length; j++) {
            const  currCell = gBoard[i][j]
            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`
            var content = ''

            content = !currCell.isRevealed ? 'N' : 'O'
            if (currCell.isRevealed && currCell.isMine) {
                content = 'B'
            }

            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i},${j})">${content}</td>`
        }

        strHTML += '</tr>'
    }

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


