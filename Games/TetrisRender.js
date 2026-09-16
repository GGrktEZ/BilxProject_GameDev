// ---------------------------------------------------------------------------
// Tetris - the drawing. READS the state, never changes it.
//
// This is the file to play with if the game should look nicer. Nothing in
// here can break a rule of the game, because nothing in here writes into the
// state.
//
// What goes in here:
//   CELL_SIZE and the colors of the background and the grid
//   drawBlock(context, col, row, colorIndex)  one single square
//   drawGrid(context)                         the empty grid behind everything
//   drawBoard(context, board)                 all blocks that already landed
//   drawPiece(context, piece)                 the falling piece
//   drawGameOver(context)                     the text over the board
//   drawGame(context, state)                  all of the above, in order
//   drawScoreboard(state)                     score, lines and level as text
//
// The board and the falling piece are stored apart, so they also get two
// drawing functions. Parts of the piece above the top row are simply not
// drawn.
//
// The whole canvas is painted again from scratch every frame. The board is
// small, that is fast enough - do not try to be clever here.
// ---------------------------------------------------------------------------

const CELL_SIZE = 27.5;
let BACKGROUND_COLOR = "#300435";
const GRID_COLOR = "#c35cff";

// --- epilepsy mode ---------------------------------------------------------
// Off until the button on the page switches it on. While it runs, the page
// background, the canvas background and the blocks each walk around the color
// wheel at their own speed, so they drift apart instead of staying in step.
let epilepsyMode = false;
let bodyHue = 0;
let canvasHue = 120;
let blockHue = 240;

const BODY_HUE_SPEED = 0.04; // degrees per millisecond
const CANVAS_HUE_SPEED = 0.07;
const BLOCK_HUE_SPEED = 0.11;

function setEpilepsyMode(on) {
  epilepsyMode = on;

  if (!on) {
    document.body.style.backgroundColor = "";
  }
}

function advanceEpilepsyColors(deltaTime) {
  if (!epilepsyMode) {
    return;
  }

  bodyHue = (bodyHue + deltaTime * BODY_HUE_SPEED) % 360;
  canvasHue = (canvasHue + deltaTime * CANVAS_HUE_SPEED) % 360;
  blockHue = (blockHue + deltaTime * BLOCK_HUE_SPEED) % 360;

  document.body.style.backgroundColor = `hsl(${bodyHue}, 100%, 15%)`;
}

function canvasColor() {
  return epilepsyMode ? `hsl(${canvasHue}, 100%, 12%)` : BACKGROUND_COLOR;
}

function blockColor(colorIndex) {
  if (!epilepsyMode) {
    return PIECE_COLORS[colorIndex];
  }

  // 51 degrees apart keeps the seven pieces spread over the wheel as it turns
  return `hsl(${(blockHue + colorIndex * 51) % 360}, 80%, 65%)`;
}

function drawBlock(context, col, row, colorIndex) {
  const x = col * CELL_SIZE;
  const y = row * CELL_SIZE;

  context.fillStyle = blockColor(colorIndex);
  context.fillRect(x, y, CELL_SIZE, CELL_SIZE);

  context.strokeStyle = canvasColor();
  context.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
}
function drawGrid(context) {
  context.strokeStyle = GRID_COLOR;
  context.lineWidth = 0.1;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      context.strokeRect(
        col * CELL_SIZE,
        row * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
      );
    }
  }
}
function drawPiece(context, piece) {
  const shape = getShape(piece);

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 0) {
        continue;
      }

      if (piece.y + row >= 0) {
        drawBlock(context, piece.x + col, piece.y + row, piece.type);
      }
    }
  }
}

function drawBoard(context, board) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] !== 0) {
        drawBlock(context, col, row, board[row][col]);
      }
    }
  }
}

function drawGame(context, state) {
  context.fillStyle = canvasColor();
  context.fillRect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE);

  drawBoard(context, state.board);
  drawGrid(context);
  drawPiece(context, state.piece);

  if (state.isGameOver) {
    let overlay = document.getElementById("tetris-game-over");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "tetris-game-over";
      overlay.textContent = "GAME OVER";
      Object.assign(overlay.style, {
        position: "absolute",
        inset: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        font: "bold 40px sans-serif",
      });
      // Over the board only. Game 3 has a second game next to it that must
      // stay visible and playable when the Tetris side is finished.
      context.canvas.parentElement.appendChild(overlay);
    }
  } else {
    document.getElementById("tetris-game-over")?.remove();
  }
}
