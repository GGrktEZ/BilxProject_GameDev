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
