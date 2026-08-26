// ---------------------------------------------------------------------------
// Flappy Bird - the Christians move in from the right, the bird falls down
// unless the player holds the space bar.
//
// The numbers below are the ones the game was built with. Changing them makes
// the game easier or harder.
// ---------------------------------------------------------------------------
const CHRISTIAN_IMAGE = "./../GameAssests/FlappyBird/christi.png";
const CHRISTIAN_SPAWN_LEFT = "100vw"; // where a new pair appears
const CHRISTIAN_LOWEST = 80; // lowest the bottom Christian can sit, in vh
const CHRISTIAN_HIGHEST = 45; // highest the bottom Christian can sit, in vh
const CHRISTIAN_GAP = 75; // how far above the bottom one the top one hangs
const CHRISTIAN_STEP = 2; // pixels a Christian moves left per step
const CHRISTIAN_DELAY = 10; // milliseconds between two steps

const BIRD_FALL_STEP = 6; // pixels the bird falls per step
const BIRD_FLAP_STEP = 6; // pixels the bird rises per step while flapping
const BIRD_DELAY = 20; // milliseconds between two steps
const BIRD_SPAWN_LEFT = "5vw"; // position of bird

const CHRISTIAN_TOP_ID = "ChristianTopPipe";
const CHRISTIAN_BOTTOM_ID = "ChristianBottomPipe";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** True for as long as the player holds the space bar down. */
let isSpacePressed = false;

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
 * Creates one Christian image and puts it on the page.
 *
 * @param   id          The id the image gets, so we can find it again.
 * @param   topInVh     Distance from the top of the screen, in vh.
 * @param   upsideDown  True for the Christian hanging from the ceiling.
 */
function createChristian(id, topInVh, upsideDown) {
  const christian = document.createElement("img");
  christian.id = id;
  christian.src = CHRISTIAN_IMAGE;
  christian.style.position = "absolute";
  christian.style.left = CHRISTIAN_SPAWN_LEFT;
  christian.style.top = topInVh + "vh";

  if (upsideDown) {
    christian.style.rotate = "180deg";
    christian.style.transform = "scaleX(-1)";
  }

  document.body.appendChild(christian);
}

// ---------------------------------------------------------------------------
// Game
// ---------------------------------------------------------------------------

/**
 * Spawns a new pair of Christians at a random height.
 */
function spawnChristianPipes() {
  const bottomInVh =
    Math.floor(Math.random() * (CHRISTIAN_LOWEST - CHRISTIAN_HIGHEST + 1)) +
    CHRISTIAN_HIGHEST;

  createChristian(CHRISTIAN_TOP_ID, bottomInVh - CHRISTIAN_GAP, true);
  createChristian(CHRISTIAN_BOTTOM_ID, bottomInVh, false);
}

/**
 * Moves the current pair of Christians to the left until they leave the
 * screen, then removes them and starts over with a new pair.
 */
async function moveChristianPipes() {
  const christianTop = document.getElementById(CHRISTIAN_TOP_ID);
  const christianBottom = document.getElementById(CHRISTIAN_BOTTOM_ID);

  while (christianBottom.offsetLeft + christianBottom.clientWidth > 0) {
    await sleep(CHRISTIAN_DELAY);
    christianTop.style.left = christianTop.offsetLeft - CHRISTIAN_STEP + "px";
    christianBottom.style.left =
      christianBottom.offsetLeft - CHRISTIAN_STEP + "px";
  }

  christianBottom.remove();
  christianTop.remove();

  spawnChristianPipes();
  moveChristianPipes();
}

/**
 * Lets the bird fall down step by step - or rise, while space is held.
 */
async function dropBird() {
  const bird = document.getElementById("bird_img");
  bird.style.left = BIRD_SPAWN_LEFT;

  while (bird.offsetTop + bird.clientHeight < window.innerHeight) {
    await sleep(BIRD_DELAY);

    if (isSpacePressed) {
      bird.style.top = bird.offsetTop - BIRD_FLAP_STEP + "px";
    } else {
      bird.style.top = bird.offsetTop + BIRD_FALL_STEP + "px";
    }
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

document.addEventListener("DOMContentLoaded", () => {
  spawnChristianPipes();
  moveChristianPipes();
  dropBird();
});
