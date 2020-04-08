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
    let currentColor = {color: "black"};

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
    incrementMoveCount(currentMoveCount);
    updatePlayerColor(playerColor);
    console.log(currentMoveCount.count, playerColor.color);
}

function trickleDown(column, color) {
    let currentRow = 0;
    let nextSlotFilled = document.getElementById("" + currentRow + column).firstChild.id;
    while (nextSlotFilled == "false" && currentRow < 6) {
        console.log("currently at:", currentRow, column);
        let theCurrentSquare = document.getElementById("" + currentRow + column);
        theCurrentSquare.firstChild.style.backgroundColor = color;
        currentRow++;
        if (currentRow < 6) {
            let theNextSquare = document.getElementById("" + currentRow + column);
            nextSlotFilled = theNextSquare.firstChild.id;
            if (nextSlotFilled == "false") { // if not at final position,
                console.log("next slot is: ", currentRow, column, "is next slot filled?: ", nextSlotFilled);
                console.log("Doing Timeout");
                setTimeout(() =>  { // "trickle down"
                    theCurrentSquare.firstChild.style.backgroundColor = "green";
                }, 1000);
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
    console.log(currentMoveCount.count);
}

function updatePlayerColor(currentColor) {
    if (currentColor.color == "black") {
        currentColor.color = "red";
    }
    else {
        currentColor.color = "black";
    }
}