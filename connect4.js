document.addEventListener("DOMContentLoaded", () => {
    makeBoard();
    playGame();
});

function makeBoard() {
    let theBoard = document.getElementById("theBoard");
    for (let row = 0; row < 6; row++) {
        for (let column = 0; column < 7; column++) {
            let boardSquare = document.createElement("div");
            boardSquare.id = "" + row + column;
            boardSquare.classList.add("boardSquare");

            let boardSlot = document.createElement("div");
            boardSlot.id = "false"; // true = is filled with a piece, false = not filled with a piece
            boardSlot.classList.add("boardSlot");

            boardSquare.appendChild(boardSlot);
            theBoard.appendChild(boardSquare);
        }
    }
    document.getElementById("resetButton").style.visibility = "hidden";
}

function playGame() {
    let theBoardSquares = document.getElementsByClassName("boardSquare");
    // register each click on the board as a move being made
    for (let i = 0; i < theBoardSquares.length; i++) {
        theBoardSquares[i].addEventListener("click", makeMove, false);
    }
    document.getElementById("theBoard").addEventListener("click", disableStartMessage, false)
}

function makeMove() {
    let isGameOver = false;
    let currentColumn = this.id.charAt(1);
    let currentPlayerColor = document.getElementsByClassName("currentPlayer")[0].firstElementChild.style.backgroundColor;

    trickleDown(currentColumn, currentPlayerColor);
    setTimeout(() => {
        isGameOver = checkWin();
        if (isGameOver) {
            let theBoardSquares = document.getElementsByClassName("boardSquare");
            // stop the players from making any new moves
            for (let i = 0; i < theBoardSquares.length; i++) {
                theBoardSquares[i].removeEventListener("click", makeMove, false);
            }
            document.getElementById("playerMessage").innerText = "Winner!";
            document.getElementById("resetButton").style.visibility = "visible";
        }
        else {
           updatePlayerColor();
       }
    }, 300);
}

function disableStartMessage() {
    let startMessage = document.getElementById("startMessage");
    startMessage.style.visibility = "hidden";
    startMessage.removeEventListener("click", disableStartMessage, false);
}

function updatePlayerColor() {
    let currentPlayer = document.getElementsByClassName("currentPlayer")[0];
    if (currentPlayer.firstElementChild.style.backgroundColor == "yellow") { // yellow is current player
        currentPlayer.classList.remove("currentPlayer");
        document.getElementById("player2").classList.add("currentPlayer");
    }
    else { // red is current player
        currentPlayer.classList.remove("currentPlayer");
        document.getElementById("player1").classList.add("currentPlayer");
    }
}

function trickleDown(column, color) {
    let currentRow = 0;
    let nextSlotFilled = document.getElementById("" + currentRow + column).firstChild.id;
    while (nextSlotFilled == "false" && currentRow < 6) {
        let theCurrentSquare = document.getElementById("" + currentRow + column);
        setTimeout(() => { // "trickle down"
            theCurrentSquare.firstChild.style.backgroundColor = color;
        }, 50 * currentRow);
        currentRow++; // check next boardSlot
        if (currentRow < 6) {
            let theNextSquare = document.getElementById("" + currentRow + column);
            nextSlotFilled = theNextSquare.firstChild.id;
            if (nextSlotFilled == "false") { // if not at final position,
                setTimeout(() =>  { // "trickle down"
                    theCurrentSquare.firstChild.style.backgroundColor = " rgba(248,248,255,0.8)";
                }, 50 * currentRow);
            }
            else { // at its final position
                theCurrentSquare.firstChild.id = "true";
            }
        }
        else {
            theCurrentSquare.firstChild.id = "true";
        }
    }
}

function checkWin() {
    let theBinaryBoard = generateBinaryBoard();
    let theBinaryBoardT = transpose(theBinaryBoard);
    let theDiagsAsRows = generateDiagsAsRows(theBinaryBoard);

    for (let i = 0; i < theDiagsAsRows.length; i++) {
        if (i < theBinaryBoard.length && compareFour(theBinaryBoard, i, 0)) {
            return true;
        }
        if (i < theBinaryBoardT.length && compareFour(theBinaryBoardT, i, 0)) {
            return true;
        }
        if (compareFour(theDiagsAsRows, i, 0)) {
            return true;
        }
    }
    return false;
 }

function generateBinaryBoard() {
    let binaryBoard = new Array(6);
    for (let row = 0; row < binaryBoard.length; row++) {
        binaryBoard[row] = new Array(7)
        for (let column = 0; column < binaryBoard[row].length; column++) {
            let currentSlot = document.getElementById("" + row + column).firstChild;
            if (currentSlot.style.backgroundColor == "yellow") {
                binaryBoard[row][column] = 0;
            }
            else if (currentSlot.style.backgroundColor == "red") {
                binaryBoard[row][column] = 1;
            }
            else {
                binaryBoard[row][column] = null;
            }
        }
    }

    return binaryBoard;
}

function compareFour(theBinaryBoard, rowToCheck, startColumn) {
    let numColumns = theBinaryBoard[rowToCheck].length;
    if (startColumn == numColumns - 3) {
        return false;
    }

    if (
        theBinaryBoard[rowToCheck][startColumn] != null &&
        (theBinaryBoard[rowToCheck][startColumn] === theBinaryBoard[rowToCheck][startColumn + 1]) &&
        (theBinaryBoard[rowToCheck][startColumn + 1] === theBinaryBoard[rowToCheck][startColumn + 2]) &&
        (theBinaryBoard[rowToCheck][startColumn + 2] === theBinaryBoard[rowToCheck][startColumn + 3]) )
    {
        return true;
    }

    return compareFour(theBinaryBoard, rowToCheck, startColumn + 1); // shift over one column and compare the next 4
}

function transpose(theBinaryBoard) {
    let newNumRows = theBinaryBoard[0].length;
    let newNumColums = theBinaryBoard.length;
    let transposedBoard = new Array(newNumRows);
    for (let row = 0; row < newNumRows; row++) {
        transposedBoard[row] = new Array(newNumColums);
        for (let column = 0; column < newNumColums; column++) {
            transposedBoard[row][column] = theBinaryBoard[column][row];
        }
    }

    return transposedBoard;
}

function getSingleDiagAsRow(theBinaryBoard, startRow, startColumn, isMainDiag) {
    let currentRow = startRow;
    let currentColumn = startColumn;

    let newRow = [];
    while (currentRow < theBinaryBoard.length && currentColumn < theBinaryBoard[0].length
            && currentColumn >= 0) { // <-- for antidiagonal
        newRow.push(theBinaryBoard[currentRow][currentColumn]);
        currentRow++;
        if (isMainDiag) {
            currentColumn++;
        }
        else { // antidiagonal
            currentColumn--;
        }
    }

    return newRow;
}

function generateDiagsAsRows(theBinaryBoard) {
    let startRow = 0;
    let mainStartColumn = 4;
    let antiStartColumn = 2;

    let diagsAsRows = [];

    for (let i = 0; i < theBinaryBoard.length; i++) {
        if (i < 4) {
            diagsAsRows.push(getSingleDiagAsRow(theBinaryBoard, startRow, --mainStartColumn, true));
            diagsAsRows.push(getSingleDiagAsRow(theBinaryBoard, startRow, ++antiStartColumn, false));
        }
        else {
            startRow++;
            diagsAsRows.push(getSingleDiagAsRow(theBinaryBoard, startRow, mainStartColumn, true));
            diagsAsRows.push(getSingleDiagAsRow(theBinaryBoard, startRow, antiStartColumn, false));
        }
    }

    return diagsAsRows;
}