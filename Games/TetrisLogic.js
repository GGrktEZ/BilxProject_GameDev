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

const ROWS = 25;
const COLS = 10;
