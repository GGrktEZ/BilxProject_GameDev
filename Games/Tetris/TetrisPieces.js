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

const PIECE_I = 1;
const PIECE_O = 2;
const PIECE_T = 3;
const PIECE_S = 4;
const PIECE_Z = 5;
const PIECE_J = 6;
const PIECE_L = 7;


/** All piece types, so we can pick a random one. */
const PIECE_TYPES = [PIECE_I, PIECE_O, PIECE_T, PIECE_S, PIECE_Z, PIECE_J, PIECE_L];

/** One color per piece type. Index 0 is never drawn, it stands for "empty". */
const PIECE_COLORS = [
  "#000000", // 0 - empty, unused
  "#38bdf8", // 1 - I, light blue
  "#facc15", // 2 - O, yellow
  "#c084fc", // 3 - T, purple
  "#4ade80", // 4 - S, green
  "#f87171", // 5 - Z, red
  "#60a5fa", // 6 - J, blue
  "#fb923c", // 7 - L, orange
];

/**
 * The shapes. PIECES[type][rotation] gives one matrix.
 *
 * Rotation goes 0 -> 1 -> 2 -> 3 -> 0, always clockwise.
 */
const PIECES = {};

PIECES[PIECE_I] = [
  // rotation 0
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // rotation 1
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  // rotation 2
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  // rotation 3
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
];

PIECES[PIECE_O] = [
  // the square looks the same in every rotation
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
];

PIECES[PIECE_T] = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

PIECES[PIECE_S] = [
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

PIECES[PIECE_Z] = [
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
];

PIECES[PIECE_J] = [
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
];

PIECES[PIECE_L] = [
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
];
