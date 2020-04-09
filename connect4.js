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
}

function playGame() {
    let moveCount = {count: 0}; // both declared as objects to pass by reference
    let currentColor = {color: "yellow"};

    let theBoardSquares = document.getElementsByClassName("boardSquare");
    for (let i = 0; i < theBoardSquares.length; i++) {
        theBoardSquares[i].addEventListener("click", () => {
            console.log("click");
            makeMove(theBoardSquares[i], currentColor, moveCount)});
    }
}

function makeMove(aBoardSquare, playerColor, currentMoveCount) {
    let currentColumn = aBoardSquare.id.charAt(1);
    trickleDown(currentColumn, playerColor.color);
    setTimeout(checkWin, 600);
    incrementMoveCount(currentMoveCount);
    updatePlayerColor(playerColor);
}

function trickleDown(column, color) {
    let currentRow = 0;
    let nextSlotFilled = document.getElementById("" + currentRow + column).firstChild.id;
    while (nextSlotFilled == "false" && currentRow < 6) {
        let theCurrentSquare = document.getElementById("" + currentRow + column);
        setTimeout(() => { // "trickle down"
            theCurrentSquare.firstChild.style.backgroundColor = color;
        }, 100 * currentRow);
        currentRow++;
        if (currentRow < 6) {
            let theNextSquare = document.getElementById("" + currentRow + column);
            nextSlotFilled = theNextSquare.firstChild.id;
            if (nextSlotFilled == "false") { // if not at final position,
                setTimeout(() =>  { // "trickle down"
                    theCurrentSquare.firstChild.style.backgroundColor = "white";
                }, 100 * currentRow);
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

function incrementMoveCount(currentMoveCount) {
    currentMoveCount.count++;
}

function updatePlayerColor(currentColor) {
    if (currentColor.color == "yellow") {
        currentColor.color = "red";
    }
    else {
        currentColor.color = "yellow";
    }
}

function checkWin() {
    let theBinaryBoard = generateBinaryBoard();
    let theBinaryBoardT = transpose(theBinaryBoard);
    
    console.log(theBinaryBoard, theBinaryBoardT);

    for (let i = 0; i < theBinaryBoardT.length; i++) {
        console.log("Checking row: ", i);
        if (i < theBinaryBoardT.length - 1) {
            if (compareFour(theBinaryBoard, i, 0)) {
                alert("Win Detected Horizontally!");
            }
        }
        if(compareFour(theBinaryBoardT, i, 0)) {
            alert("Win Detected Vertically!");
        }
    }
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
        (theBinaryBoard[rowToCheck][startColumn] === theBinaryBoard[rowToCheck][startColumn + 1]) &&
        (theBinaryBoard[rowToCheck][startColumn + 1] === theBinaryBoard[rowToCheck][startColumn + 2]) &&
        (theBinaryBoard[rowToCheck][startColumn + 2] === theBinaryBoard[rowToCheck][startColumn + 3]) &&
        theBinaryBoard[rowToCheck][startColumn] != null )
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