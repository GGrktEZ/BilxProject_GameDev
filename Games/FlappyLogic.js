// ---------------------------------------------------------------------------
// Flappy Bird - the Christians move in from the right, the bird falls down
// unless the player holds the space bar.
//
// The numbers below are the ones the game was built with. Changing them makes
// the game easier or harder.
// ---------------------------------------------------------------------------
const CHRISTIAN_IMAGE = "./../GameAssests/FlappyBird/christi.png";
const CHRISTIAN_PAIRS = 51; // how many pairs get spawned at the start
const CHRISTIAN_SPAWN_LEFT = 100; // where a new pair appears
const CHRISTIAN_LOWEST = 80; // lowest the bottom Christian can sit, in vh
const CHRISTIAN_HIGHEST = 45; // highest the bottom Christian can sit, in vh
const CHRISTIAN_GAP = 75; // how far above the bottom one the top one hangs
const CHRISTIAN_STEP = 2; // pixels a Christian moves left per step
const CHRISTIAN_DELAY = 8; // milliseconds between two steps

const BIRD_IMAGE = "./../GameAssests/FlappyBird/bird.png";
const BIRD_DELAY = 20; // milliseconds between two steps
const BIRD_SPAWN_LEFT = "5vw"; // position of bird

const HITBOX_ALPHA = 10; // a pixel more see-through than this cannot be hit
const HITBOX_STEP = 2; // screen pixels between two samples of the overlap
const HITBOX_INSET = 0.2; // box shrink per side when no mask is available

let BIRD_VELOCITY = -8; // current velocity of the bird

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** True for as long as the player holds the space bar down. */
let isSpacePressed = false;
/** True when the game is over. */
let gameOver = false;
/** The current score for the game. Based on Time Survived */
let gameScore = 0;
/** One alpha mask per image source, so we can hit-test the drawing itself. */
const alphaMasks = new Map();


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Sleeps for a given amount of milliseconds.
 *
 * @param   ms  The amount of milliseconds to sleep.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Loads an image once and remembers how see-through every one of its pixels
 * is. That table is what turns the square hitbox into the shape of the
 * drawing.
 *
 * @param   src  The image to read.
 */
function loadAlphaMask(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0);

      try {
        const pixels = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        ).data;

        const alpha = new Uint8Array(canvas.width * canvas.height);
        for (let i = 0; i < alpha.length; i++) {
          alpha[i] = pixels[i * 4 + 3];
        }

        alphaMasks.set(image.src, {
          width: canvas.width,
          height: canvas.height,
          alpha,
        });
      } catch (error) {
        // Opening the page as a file:// document forbids reading the pixels
        // back. The game then falls back to slightly shrunken boxes.
        console.warn(
          "No pixel hitbox for " + src + " - serve the page over http.",
          error,
        );
      }

      resolve();
    };

    image.onerror = () => resolve();
    image.src = src;
  });
}

/**
 * Tells whether the drawing of an image covers a point on the screen.
 *
 * @param   mask     The alpha mask belonging to the image.
 * @param   element  The image on the page.
 * @param   rect     The already measured box of that image.
 * @param   x        Point on the screen, in pixels.
 * @param   y        Point on the screen, in pixels.
 */
function isSolidAt(mask, element, rect, x, y) {
  const acrossX = (x - rect.left) / rect.width;
  let acrossY = (y - rect.top) / rect.height;

  if (element.dataset.flippedY === "true") {
    acrossY = 1 - acrossY;
  }

  const pixelX = Math.floor(acrossX * mask.width);
  const pixelY = Math.floor(acrossY * mask.height);

  if (
    pixelX < 0 ||
    pixelY < 0 ||
    pixelX >= mask.width ||
    pixelY >= mask.height
  ) {
    return false;
  }

  return mask.alpha[pixelY * mask.width + pixelX] >= HITBOX_ALPHA;
}

/**
 * Checks whether two images really touch, meaning a visible pixel of the one
 * sits on a visible pixel of the other. Only the part where both boxes
 * overlap has to be looked at.
 *
 * @param   first        The first image on the page.
 * @param   firstRect    The already measured box of the first image.
 * @param   second       The second image on the page.
 * @param   secondRect   The already measured box of the second image.
 */
function imagesTouch(first, firstRect, second, secondRect) {
  const left = Math.max(firstRect.left, secondRect.left);
  const right = Math.min(firstRect.right, secondRect.right);
  const top = Math.max(firstRect.top, secondRect.top);
  const bottom = Math.min(firstRect.bottom, secondRect.bottom);

  if (right <= left || bottom <= top) return false;

  const firstMask = alphaMasks.get(first.src);
  const secondMask = alphaMasks.get(second.src);

  // Without masks we can only fall back to boxes, so at least shrink them.
  if (!firstMask || !secondMask) {
    const insetX = Math.min(firstRect.width, secondRect.width) * HITBOX_INSET;
    const insetY = Math.min(firstRect.height, secondRect.height) * HITBOX_INSET;
    return right - left > insetX && bottom - top > insetY;
  }

  for (let y = top; y < bottom; y += HITBOX_STEP) {
    for (let x = left; x < right; x += HITBOX_STEP) {
      if (
        isSolidAt(firstMask, first, firstRect, x, y) &&
        isSolidAt(secondMask, second, secondRect, x, y)
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Creates one Christian image and puts it on the page.
 *
 * @param   id          The id the image gets, so we can find it again.
 * @param   topInVh     Distance from the top of the screen, in vh.
 * @param   upsideDown  True for the Christian hanging from the ceiling.
 * @param   offset      How far to the right of the spawn point the Christian
 */
function createChristian(id, topInVh, upsideDown, offset) {
  const christian = document.createElement("img");
  christian.id = id;
  christian.src = CHRISTIAN_IMAGE;
  christian.style.position = "absolute";
  christian.style.left = CHRISTIAN_SPAWN_LEFT + offset + "vw";
  christian.style.top = topInVh + "vh";

  if (upsideDown) {
    // A 180deg turn plus a horizontal mirror is simply an upside down image,
    // which is what the hit test has to undo again.
    christian.style.rotate = "180deg";
    christian.style.transform = "scaleX(-1)";
    christian.dataset.flippedY = "true";
  }

  document.body.appendChild(christian);
  return christian;
}

// ---------------------------------------------------------------------------
// Game
// ---------------------------------------------------------------------------

/**
 * Spawns a new pair of Christians at a random height.
 * Moves the current pair of Christians to the left until they leave the
 * screen, then removes them and starts over with a new pair.
 * 
 * @param   id      The id of the Christian pair, so we can find them again.
 * @param   offset  How far to the right of the spawn point the Christian pair
 *                  should appear. 
 */
async function spawnChristianPipes(id, offset) {
  const bottomInVh =
    Math.floor(Math.random() * (CHRISTIAN_LOWEST - CHRISTIAN_HIGHEST + 1)) +
    CHRISTIAN_HIGHEST;

  const christianTop = createChristian(
    id + "_top",
    bottomInVh - CHRISTIAN_GAP,
    true,
    offset,
  );
  const christianBottom = createChristian(
    id + "_bottom",
    bottomInVh,
    false,
    offset,
  );

  while (christianBottom.offsetLeft + christianBottom.clientWidth > 0) {
    await sleep(CHRISTIAN_DELAY);

    if (gameOver) return; // Stop moving if game is over

    christianTop.style.left = christianTop.offsetLeft - CHRISTIAN_STEP + "px";
    christianBottom.style.left =
      christianBottom.offsetLeft - CHRISTIAN_STEP + "px";

  }

  if (gameOver) return; // Don't spawn new pipes if game is over

  christianBottom.remove();
  christianTop.remove();
}

/**
 * Lets the bird fall down step by step - or rise, while space is held.
 */
async function dropBird() {
  const bird = document.getElementById("bird_img");
  bird.style.left = BIRD_SPAWN_LEFT;

  while (bird.offsetTop + bird.clientHeight < window.innerHeight && !gameOver) {
    await sleep(BIRD_DELAY);

    if (isSpacePressed) {
      BIRD_VELOCITY = -8.5; // Bird rises when space is pressed
    }
    bird.style.top = bird.offsetTop + BIRD_VELOCITY + "px"
    BIRD_VELOCITY = BIRD_VELOCITY + 0.5; // Gravity effect

    // Check collision with Christians
    if (birdChristian(bird)) {
      endGame();
    }
  }

  // Game over if bird hits the bottom
  if (!gameOver) {
    endGame();
  }
}


/**
 * Checks if the bird collides with either Christian pipe. The check is done
 * on the drawings, not on the boxes around them.
 *
 * @param   bird    The bird element.
 * @returns {boolean} True if the bird collides with a Christian pipe, false otherwise.
 */
function birdChristian(bird) {
  const birdRect = bird.getBoundingClientRect();

  for (let i = 1; i <= CHRISTIAN_PAIRS; i++) {
    const christianTop = document.getElementById("christi" + i + "_top");
    const christianBottom = document.getElementById("christi" + i + "_bottom");

    if (!christianTop || !christianBottom) continue;

    // Both Christians of a pair share the same column, so one look to the
    // side is enough to skip a whole pair.
    const bottomRect = christianBottom.getBoundingClientRect();
    if (bottomRect.right < birdRect.left || bottomRect.left > birdRect.right) {
      continue;
    }

    const topRect = christianTop.getBoundingClientRect();

    if (
      imagesTouch(bird, birdRect, christianTop, topRect) ||
      imagesTouch(bird, birdRect, christianBottom, bottomRect)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Ends the game and displays a game over message.
 */
function endGame() {
  gameOver = true;
  alert("Game Over! You hit a Christian! :Score = " + gameScore);
}


async function updateScore() {
  const scoreElement = document.getElementById("score");
  while (true) {
    await sleep(1000);
    gameScore++;
    scoreElement.textContent = "Your Score is: " + gameScore;
  }
}

// ---------------------------------------------------------------------------
// Events - this is where the game starts.
// ---------------------------------------------------------------------------
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    isSpacePressed = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    isSpacePressed = false;
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  // The masks have to be there before the first collision check runs.
  await Promise.all([loadAlphaMask(BIRD_IMAGE), loadAlphaMask(CHRISTIAN_IMAGE)]);

  for (let i = 0; i < CHRISTIAN_PAIRS; i++) {
    spawnChristianPipes("christi" + (i + 1), i * 50);
  }
  dropBird();
  updateScore();
});


