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
// The mode was not built in one go, it grew one effect at a time. The dropdown
// on the page picks how far along that road to go, so every step can be shown
// on its own:
//
//   0  off, the plain game
//   1  the page behind the board walks around the color wheel
//   2  the board itself walks around it too, at another speed
//   3  and so do the blocks, at a third speed
//   4  the board starts turning, always the same way
//   5  the turning swings: full speed one way, a standstill, back the other
//   6  the board breathes, growing and shrinking
//   7  the board slides from one edge of the screen to the other
//
// Every step keeps the ones before it, so level 7 is everything at once.
//
// Sliding, turning and growing are done to the canvas ELEMENT, not to the
// drawing. The game has no idea that it happens: the piece still falls straight
// down in the board, only the screen moves. So nothing here can break a rule.
const LEVEL_OFF = 0;
const LEVEL_PAGE_COLOR = 1;
const LEVEL_BOARD_COLOR = 2;
const LEVEL_BLOCK_COLOR = 3;
const LEVEL_SPIN = 4;
const LEVEL_SWING = 5;
const LEVEL_PULSE = 6;
const LEVEL_DRIFT = 7;

let epilepsyLevel = LEVEL_OFF;
let bodyHue = 0;
let canvasHue = 120;
let blockHue = 240;
let boardSpin = 0;
let boardSpinPhase = 0;
let boardPulse = 0;
let boardDrift = 0;

const BODY_HUE_SPEED = 0.04; // degrees per millisecond
const CANVAS_HUE_SPEED = 0.07;
const BLOCK_HUE_SPEED = 0.11;
const BOARD_SPIN_STEADY_SPEED = 0.04; // degrees per ms, level 4
const BOARD_SPIN_TOP_SPEED = 0.2; // degrees per ms at the fastest moment
const BOARD_SPIN_TURN_SPEED = 0.0008; // radians per ms, a reverse every ~4s
const BOARD_PULSE_SPEED = 0.004; // radians per millisecond, one breath ~ 1.6s
const BOARD_PULSE_DEPTH = 0.15; // 0.15 means 15% bigger and 15% smaller
const BOARD_DRIFT_SPEED = 0.0015; // radians per ms, one trip and back ~ 4.2s

function setEpilepsyLevel(level) {
  epilepsyLevel = level;

  if (level < LEVEL_PAGE_COLOR) {
    document.body.style.backgroundColor = "";
  }
}

function advanceEpilepsy(deltaTime) {
  if (epilepsyLevel === LEVEL_OFF) {
    return;
  }

  bodyHue = (bodyHue + deltaTime * BODY_HUE_SPEED) % 360;
  canvasHue = (canvasHue + deltaTime * CANVAS_HUE_SPEED) % 360;
  blockHue = (blockHue + deltaTime * BLOCK_HUE_SPEED) % 360;

  // Level 4 turns at one steady speed. From level 5 on, the SPEED is the thing
  // that swings, not the angle: it rides a sine from full speed one way, down
  // through a standstill, to full speed the other way - so the board winds up,
  // stops and unwinds again.
  boardSpinPhase =
    (boardSpinPhase + deltaTime * BOARD_SPIN_TURN_SPEED) % (Math.PI * 2);
  const spinSpeed =
    epilepsyLevel >= LEVEL_SWING
      ? Math.sin(boardSpinPhase) * BOARD_SPIN_TOP_SPEED
      : BOARD_SPIN_STEADY_SPEED;

  boardSpin = (boardSpin + deltaTime * spinSpeed) % 360;
  boardPulse = (boardPulse + deltaTime * BOARD_PULSE_SPEED) % (Math.PI * 2);
  boardDrift = (boardDrift + deltaTime * BOARD_DRIFT_SPEED) % (Math.PI * 2);

  if (epilepsyLevel >= LEVEL_PAGE_COLOR) {
    document.body.style.backgroundColor = `hsl(${bodyHue}, 100%, 15%)`;
  }
}

function boardDriftInPixels(canvas) {
  // The board rests in the middle of the page, so half of the free space to
  // its side is exactly the trip that puts its edge on the edge of the screen.
  // Measured every frame, which also keeps it right when the window is resized.
  const reach = (document.documentElement.clientWidth - canvas.width) / 2;

  return Math.sin(boardDrift) * reach;
}

function transformBoard(canvas) {
  // An empty string means "no transform at all", which is what a level that has
  // not reached this effect yet has to look like.
  canvas.style.translate =
    epilepsyLevel >= LEVEL_DRIFT ? boardDriftInPixels(canvas) + "px" : "";

  canvas.style.rotate = epilepsyLevel >= LEVEL_SPIN ? boardSpin + "deg" : "";

  // sin swings between -1 and 1, so the board grows and shrinks around its
  // normal size instead of only ever getting bigger
  canvas.style.scale =
    epilepsyLevel >= LEVEL_PULSE
      ? String(1 + Math.sin(boardPulse) * BOARD_PULSE_DEPTH)
      : "";
}

function canvasColor() {
  if (epilepsyLevel < LEVEL_BOARD_COLOR) {
    return BACKGROUND_COLOR;
  }

  return `hsl(${canvasHue}, 100%, 12%)`;
}

function blockColor(colorIndex) {
  if (epilepsyLevel < LEVEL_BLOCK_COLOR) {
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
  transformBoard(context.canvas);

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
