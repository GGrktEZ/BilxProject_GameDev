// ---------------------------------------------------------------------------
// Tetris - the rules. Changes the state, draws nothing.
//
// What goes in here:
//   getShape(piece)                     look up the matrix for the piece
//   isValidPosition(board, shape, x, y) may the piece stand here? yes / no
//   spawnPiece()                        put a new random piece on top
//   movePiece(stepX)                    move left (-1) or right (+1)
//   rotatePiece()                       turn clockwise
//   dropPieceOneRow()                   one row down, or land
//   hardDrop()                          all the way down at once
//   lockPiece()                         write the piece into the board
//   clearFullRows(board)                remove full rows, return how many
//   resetGame()                         start a fresh game
//
// isValidPosition is the only place that decides what is allowed. Every move
// uses the same three steps:
//
//   1. work out the new place (x - 1, or y + 1, or the next rotation)
//   2. ask isValidPosition
//   3. keep it if it fits, throw it away if it does not
//
// Two special cases:
//   - a downward move that does NOT fit means the piece has landed: write it
//     into the board, clear full rows, bring the next piece
//   - a rotation that does not fit is tried again 1 and 2 columns to the left
//     and to the right before giving up (that is the "wall kick")
//
// Cells above the top row are ignored when checking, so a new piece may start
// half above the board.
// ---------------------------------------------------------------------------

const ROWS = 20;
const COLS = 10;

// ---------------------------------------------------------------------------
// Help us
// ---------------------------------------------------------------------------
function getShape(piece) {
  return PIECES[piece.type][piece.rotation];
}
const state = {
  board: [],
  piece: null,
  dropInterval: 1000,
  isGameOver: false,
};
function createEmptyBoard() {
  const board = [];
  for (let row = 0; row < ROWS; row++) {
    board.push(new Array(COLS).fill(0));
  }
  return board;
}
function isValidPosition(board, shape, x, y) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 0) {
        continue;
      }

      const boardX = x + col;
      const boardY = y + row;
      if (boardX >= COLS || boardX < 0 || boardY >= ROWS) {
        return false;
      }

      if (boardY < 0) {
        continue;
      }

      if (board[boardY][boardX] !== 0) {
        return false;
      }
    }
  }
  return true;
}

function spawnPiece() {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];

  state.piece = {
    type: type,
    rotation: 0,
    x: COLS / 2,
    y: 0,
  };

  if (
    !isValidPosition(
      state.board,
      getShape(state.piece),
      state.piece.x,
      state.piece.y,
    )
  ) {
    state.isGameOver = true;
  }
}

function movePiece(stepX) {
  if (state.isGameOver) {
    return false;
  }
  const newX = state.piece.x + stepX;
  if (
    !isValidPosition(state.board, getShape(state.piece), newX, state.piece.y)
  ) {
    return false;
  }
  state.piece.x = newX;

  return true;
}

function lockPiece() {
  const shape = getShape(state.piece);

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 0) {
        continue;
      }

      const boardY = state.piece.y + row;
      const boardX = state.piece.x + col;

      // Cells above the top row simply fall off the board.
      if (boardY >= 0) {
        state.board[boardY][boardX] = state.piece.type;
      }
    }
  }
  clearFullRows(state.board);
  spawnPiece();
}

function dropPieceOneRow() {
  if (state.isGameOver) {
    return false;
  }

  const newY = state.piece.y + 1;
  if (
    !isValidPosition(state.board, getShape(state.piece), state.piece.x, newY)
  ) {
    lockPiece();
    return false;
  }

  state.piece.y = newY;

  return true;
}

function hardDrop() {
  if (state.isGameOver) {
    return false;
  }
  while (dropPieceOneRow()) {}
}

function rotatePiece() {
  if (state.isGameOver) {
    return false;
  }
  const newRotate = state.piece.rotation + (1 % 4);
  const newShape = PIECES[state.piece.type][newRotate];
  if (!isValidPosition(state.board, newShape, state.piece.x, state.piece.y)) {
    return false;
  }
  state.piece.rotation = newRotate;
  return true;
}

function clearFullRows(board) {
  for (let row = ROWS - 1; row >= 0; row--) {
    const isFull = !board[row].includes(0);

    if (!isFull) {
      continue;
    }
    board.splice(row, 1);
    board.unshift(new Array(COLS).fill(0));
    row++;
  }
}

function clearFullRows(board) {
  for (let row = ROWS - 1; row >= 0; row--) {
    const isFull = !board[row].includes(0);

    if (!isFull) {
      continue;
    }
    board.splice(row, 1);
    board.unshift(new Array(COLS).fill(0));
    row++;
  }
}
