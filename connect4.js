document.addEventListener("DOMContentLoaded", () => {
    makeBoard();
});

function makeBoard() {
    let theBoard = document.getElementById("theBoard");
    for (let row = 0; row < 6; row++) {
        for (let column = 0; column < 7; column++) {
            let boardSlot = document.createElement("div");
            boardSlot.id = "" + row + column;
            boardSlot.classList.add("boardSlot");
            theBoard.appendChild(boardSlot);
        }
    }
}