// ---------------------------------------------------------------------------
// Tetris - the state. PLAIN DATA ONLY: arrays and numbers.
//
// This file knows nothing about the canvas and nothing about the rules. If a
// line in here mentions drawing, it is in the wrong file.
//
// What goes in here:
//   - ROWS and COLS (the board is 20 rows tall and 10 columns wide)
//   - createEmptyBoard(): a 2D array, every cell 0
//   - the state object, which holds:
//       board        every cell is 0 (empty) or a piece type 1 - 7
//       piece        the falling piece: { type, rotation, x, y }
//       score, lines, level
//       isGameOver
//       dropInterval how many milliseconds until the piece falls one row
//       dropCounter  how many milliseconds have passed since the last fall
//
// The most important rule of the whole game:
//
//   The falling piece is NOT part of the board.
//
// The board only holds blocks that already landed. The falling piece is its
// own small object. They are drawn together, but they are stored apart - only
// that way a piece can still be moved back out of a place.
// ---------------------------------------------------------------------------
