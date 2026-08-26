// ---------------------------------------------------------------------------
// Settings - change these numbers to make the game easier or harder.
// ---------------------------------------------------------------------------
const CHRISTIAN_IMAGE = "./../GameAssests/FlappyBird/christi.png";
const CHRISTIAN_GAP_HIGHEST = 45; // highest the gap can be placed (in vh)
const CHRISTIAN_GAP_LOWEST = 80; // lowest the gap can be placed (in vh)
const CHRISTIAN_GAP_SIZE = 75; // how far above the gap the top Christian sits
const CHRISTIAN_STEP = 2; // pixels the Christians move left per step
const CHRISTIAN_DELAY = 10; // milliseconds between two steps

const BIRD_FALL_STEP = 10; // pixels the bird falls per step
const BIRD_FLAP_STEP = 10; // pixels the bird rises per step while flapping
const BIRD_DELAY = 20; // milliseconds between two steps

// ---------------------------------------------------------------------------
// Elements and state we need again and again.
// ---------------------------------------------------------------------------
const bird = document.getElementById("bird_img");

// True for as long as the player holds the space bar down.
let isSpacePressed = false;

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
  christian.style.left = "75vw";
  christian.style.top = topInVh + "vh";

  if (upsideDown) {
    christian.style.rotate = "180deg";
    christian.style.transform = "scaleX(-1)";
  }

  document.body.appendChild(christian);
}

/**
 * Spawns a new pair of Christians with a random gap between them.
 */
function spawnChristians() {
  const gapPosition =
    Math.floor(
      Math.random() * (CHRISTIAN_GAP_LOWEST - CHRISTIAN_GAP_HIGHEST + 1)
    ) + CHRISTIAN_GAP_HIGHEST;

  createChristian("ChristianTopPipe", gapPosition - CHRISTIAN_GAP_SIZE, true);
  createChristian("ChristianBottomPipe", gapPosition, false);
}

/**
 * Moves the current pair of Christians to the left until they leave the
 * screen, then removes them and starts over with a new pair.
 */
async function moveChristians() {
  const christianTop = document.getElementById("ChristianTopPipe");
  const christianBot = document.getElementById("ChristianBottomPipe");

  while (christianBot.offsetLeft + christianBot.clientWidth > 0) {
    await sleep(CHRISTIAN_DELAY);
    christianTop.style.left = christianTop.offsetLeft - CHRISTIAN_STEP + "px";
    christianBot.style.left = christianBot.offsetLeft - CHRISTIAN_STEP + "px";
  }

  christianTop.remove();
  christianBot.remove();

  spawnChristians();
  moveChristians();
}

/**
 * Lets the bird fall down step by step - or rise, while space is held.
 */
async function dropBird() {
  while (bird.offsetTop + bird.clientHeight > 0) {
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
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    isSpacePressed = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.code === "Space") {
    isSpacePressed = false;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  spawnChristians();
  moveChristians();
  dropBird();
});
