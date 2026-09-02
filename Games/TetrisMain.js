// ---------------------------------------------------------------------------
// Tetris - start, keyboard and the game loop.
// This file glues the rest together: the keyboard changes the state, the loop lets the piece fall and
// asks the drawing to paint the new picture.
//
// What goes in here:
//   - find the canvas (id "tetris_canvas") and get its 2D context,
//     set canvas.width and canvas.height from COLS, ROWS and CELL_SIZE
//   - gameLoop(currentTime), started with requestAnimationFrame:
//       deltaTime = currentTime - lastFrameTime
//       state.dropCounter += deltaTime
//       when dropCounter is bigger than dropInterval:
//         drop the piece one row and set dropCounter back to 0
//       then draw everything and ask for the next frame
//   - one keydown listener that changes the state directly:
//       left / right  move, up  rotate, down  drop faster,
//       space  drop instantly, R  new game
//     (call event.preventDefault() for these keys, otherwise the page scrolls)
//   - at the very bottom: resetGame() and start the loop
//
// We count MILLISECONDS, not frames. On a faster screen there are more frames
// per second, but a second stays a second - so the game runs equally fast on
// every computer. Do not use setInterval for the falling, and do not count
// frames.
// ---------------------------------------------------------------------------
