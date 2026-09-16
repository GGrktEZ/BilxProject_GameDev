// ---------------------------------------------------------------------------
// Game 3 - Flappris. Flappy Bird and Tetris on one page, at the same time.
//
// This file is the Tetris half of the glue. The Flappy half starts itself in
// FlappyLogic.js, which is loaded next to this file and needs no help.
//
// It is almost the same as TetrisMain.js, with one difference that matters:
//   the space bar is NOT taken by the hard drop here.
// Space belongs to the bird in this game, so Tetris only listens to the four
// arrow keys and to R for a new board.
//
// Both halves are their own game. They share the screen and the keyboard, not
// their state - a lost bird does not end the Tetris side, and a full board
// does not end the bird.
// ---------------------------------------------------------------------------

const canvas = document.getElementById("tetris_canvas");
const context = canvas.getContext("2d");

let lastFrameTime = 0;

canvas.width = CELL_SIZE * COLS;
canvas.height = CELL_SIZE * ROWS;

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    movePiece(-1);
  }
  if (event.code === "ArrowRight") {
    movePiece(1);
  }
  if (event.code === "ArrowDown") {
    dropPieceOneRow();
    state.dropCounter = 0;
  }
  if (event.code === "ArrowUp") {
    rotatePiece();
  }
  if (event.code === "KeyR") {
    resetGame();
  }

  // Space is in this list but has no Tetris move above: the page must not
  // scroll when the player flaps, and FlappyLogic.js reads the key itself.
  if (
    ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "Space"].includes(
      event.code,
    )
  ) {
    event.preventDefault();
  }
});

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastFrameTime;
  lastFrameTime = currentTime;

  if (!state.isGameOver) {
    state.dropCounter += deltaTime;

    if (state.dropCounter > state.dropInterval) {
      dropPieceOneRow();
      state.dropCounter = 0;
    }
  }

  drawGame(context, state);
  requestAnimationFrame(gameLoop);
}

resetGame();
requestAnimationFrame(gameLoop);
