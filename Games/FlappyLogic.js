// ---------------------------------------------------------------------------
// Flappy Bird - the Christians move in from the right, the bird falls down
// unless the player holds the space bar.
//
// The numbers below are the ones the game was built with. Changing them makes
// the game easier or harder.
// ---------------------------------------------------------------------------
const CHRISTIAN_IMAGE = "./../GameAssests/FlappyBird/christi.png";
const CHRISTIAN_SPAWN_LEFT = 100; // where a new pair appears
const CHRISTIAN_LOWEST = 80; // lowest the bottom Christian can sit, in vh
const CHRISTIAN_HIGHEST = 45; // highest the bottom Christian can sit, in vh
const CHRISTIAN_GAP = 75; // how far above the bottom one the top one hangs
const CHRISTIAN_STEP = 2; // pixels a Christian moves left per step
const CHRISTIAN_DELAY = 10; // milliseconds between two steps

const BIRD_FALL_STEP = 6; // pixels the bird falls per step
const BIRD_FLAP_STEP = 6; // pixels the bird rises per step while flapping
const BIRD_DELAY = 20; // milliseconds between two steps
const BIRD_SPAWN_LEFT = "5vw"; // position of bird

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** True for as long as the player holds the space bar down. */
let isSpacePressed = false;

/** True when the game is over. */
let gameOver = false;
/** The current score for the game. Based on Time Survived */
let gameScore = 0;


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
    christian.style.rotate = "180deg";
    christian.style.transform = "scaleX(-1)";
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
    id,
    bottomInVh - CHRISTIAN_GAP,
    true,
    offset,
  );
  const christianBottom = createChristian(id, bottomInVh, false, offset);

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
      bird.style.top = bird.offsetTop - BIRD_FLAP_STEP + "px";
    } else {
      bird.style.top = bird.offsetTop + BIRD_FALL_STEP + "px";
      
    }

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
 * Checks if the bird collides with either Christian pipe.
 * @param   bird    The bird element.
 * @returns {boolean} True if the bird collides with a Christian pipe, false otherwise.
 */
function birdChristian(bird) {
  const christianTop = document.getElementById(CHRISTIAN_TOP_ID);
  const christianBottom = document.getElementById(CHRISTIAN_BOTTOM_ID);

  if (!christianTop || !christianBottom) return false;
  

  const birdRect = bird.getBoundingClientRect();
  const topRect = christianTop.getBoundingClientRect();
  const bottomRect = christianBottom.getBoundingClientRect();

  // Check collision with top Christian
  const collidesTop = !(
    birdRect.right < topRect.left || 
    birdRect.left > topRect.right || 
    birdRect.bottom < topRect.top || 
    birdRect.top > topRect.bottom
  );

  // Check collision with bottom Christian
  const collidesBottom = !(
    birdRect.right < bottomRect.left || 
    birdRect.left > bottomRect.right || 
    birdRect.bottom < bottomRect.top || 
    birdRect.top > bottomRect.bottom
  );
  return collidesTop || collidesBottom;
}
/**
 * Ends the game and displays a game over message.
 */
function endGame() {
  gameOver = true;
  alert("Game Over! You hit a Christian! : " );
}   


async function updateScore() {
  while (true) {
    await sleep(1000);
    gameScore++;
    console.log("Score: " + gameScore);
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
  for (let i = 0; i < 51; i++) {
    spawnChristianPipes("christi" + (i + 1), i * 50);
  }

  dropBird();
});


