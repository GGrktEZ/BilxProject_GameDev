// ---------------------------------------------------------------------------
// Tetris - the pieces. DATA ONLY, no logic in this file.
//
// What goes in here:
//   - one number per piece type: I, O, T, S, Z, J, L (1 - 7)
//   - a list of all types, so a random one can be picked
//   - one color per type
//   - PIECES[type][rotation] -> a small matrix of 0s and 1s
//     (1 = this cell of the piece is filled, 0 = empty)
//
// All four rotations of all seven pieces are written out BY HAND. We do not
// calculate rotations, we look them up. More typing, but it is only data and
// nothing can go wrong in a clever way.
//
// The type number is also the color number on the board. That is why 0 stays
// free: on the board 0 means "empty cell".
// ---------------------------------------------------------------------------
