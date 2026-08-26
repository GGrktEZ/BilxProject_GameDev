// ---------------------------------------------------------------------------
// Settings - change these numbers to make the game easier or harder.
// Everything is in pixels and seconds, so the game runs at the same speed on
// every computer, no matter how fast it is.
// ---------------------------------------------------------------------------
const CHRISTIAN_IMAGE = "./../GameAssests/FlappyBird/christi.png";
const CHRISTIAN_WIDTH = 90; // how wide one Christian is
const CHRISTIAN_GAP = 200; // the hole the bird has to fly through
const CHRISTIAN_SPACING = 380; // distance between two pairs of Christians
const CHRISTIAN_SPEED = 190; // pixels the Christians move left per second
const CHRISTIAN_MARGIN = 70; // keeps the hole away from ceiling and floor

const BIRD_WIDTH = 60; // bird.png is 468x326, so this keeps its shape
const BIRD_HEIGHT = 42;
const BIRD_LEFT = 90; // how far from the left edge the bird stays
const BIRD_GRAVITY = 1500; // pixels per second the bird gains while falling
const BIRD_FLAP_SPEED = 480; // pixels per second the bird gets from one flap
const BIRD_MAX_FALL = 750; // fastest the bird is allowed to fall

const HITBOX_PADDING = 8; // makes the bird a bit smaller, so it feels fair

// ---------------------------------------------------------------------------
// Elements and state we need again and again.
// ---------------------------------------------------------------------------
const game = document.getElementById("game");
const bird = document.getElementById("bird_img");
const scoreLabel = document.getElementById("score");
const message = document.getElementById("message");
const messageTitle = document.getElementById("message_title");
const messageText = document.getElementById("message_text");

/** All pairs of Christians that are on the screen right now. */
let christians = [];

/** Where the bird is and how fast it is going down. */
let birdTop = 0;
let birdSpeed = 0;

let score = 0;
let isRunning = false; // true while the player is actually playing
let isGameOver = false;
let lastFrameTime = 0;

/**
 * Builds one Christian image and puts it on the playing field.
 *
 * @param   top         Distance from the top of the field, in pixels.
 * @param   height      How tall the Christian should be, in pixels.
 * @param   upsideDown  True for the Christian hanging from the ceiling.
 * @returns The image element, so the caller can move it later.
 */
function createChristian(top, height, upsideDown) {
  const christian = document.createElement("img");
  christian.src = CHRISTIAN_IMAGE;
  christian.alt = "";
  christian.className = "christian";
  christian.style.position = "absolute";
  christian.style.width = CHRISTIAN_WIDTH + "px";
  christian.style.height = height + "px";
  christian.style.top = top + "px";

  if (upsideDown) {
    christian.style.rotate = "180deg";
    christian.style.transform = "scaleX(-1)";
  }

  game.appendChild(christian);
  return christian;
}

/**
 * Spawns a new pair of Christians at the right edge, with a random hole
 * somewhere between the ceiling and the floor.
 */
function spawnChristians() {
  const fieldHeight = game.clientHeight;

  // The middle of the hole, never too close to the ceiling or the floor.
  // Math.max keeps the numbers sane on a very short window.
  const highest = CHRISTIAN_MARGIN + CHRISTIAN_GAP / 2;
  const lowest = Math.max(
    fieldHeight - CHRISTIAN_MARGIN - CHRISTIAN_GAP / 2,
    highest
  );
  const gapMiddle = Math.random() * (lowest - highest) + highest;

  const topHeight = Math.max(gapMiddle - CHRISTIAN_GAP / 2, 0);
  const bottomTop = gapMiddle + CHRISTIAN_GAP / 2;
  const bottomHeight = Math.max(fieldHeight - bottomTop, 0);

  const pair = {
    left: game.clientWidth,
    topElement: createChristian(0, topHeight, true),
    bottomElement: createChristian(bottomTop, bottomHeight, false),
    isPassed: false,
  };

  drawChristians(pair);
  christians.push(pair);
}

/**
 * Puts one pair of Christians where its left value says it should be.
 *
 * @param   pair  The pair to draw.
 */
function drawChristians(pair) {
  pair.topElement.style.left = pair.left + "px";
  pair.bottomElement.style.left = pair.left + "px";
}

/**
 * Takes a pair of Christians off the page again.
 *
 * @param   pair  The pair to remove.
 */
function removeChristians(pair) {
  pair.topElement.remove();
  pair.bottomElement.remove();
}

/**
 * Checks whether the bird is touching one of the Christians.
 *
 * @param   pair  The pair to check against.
 * @returns True if the bird crashed into this pair.
 */
function hitsChristians(pair) {
  const birdLeft = BIRD_LEFT + HITBOX_PADDING;
  const birdRight = BIRD_LEFT + BIRD_WIDTH - HITBOX_PADDING;
  const birdTopEdge = birdTop + HITBOX_PADDING;
  const birdBottomEdge = birdTop + BIRD_HEIGHT - HITBOX_PADDING;

  // Not next to each other yet, so nothing can touch.
  if (birdRight < pair.left || birdLeft > pair.left + CHRISTIAN_WIDTH) {
    return false;
  }

  const topEnds = pair.topElement.offsetHeight;
  const bottomStarts = pair.bottomElement.offsetTop;

  return birdTopEdge < topEnds || birdBottomEdge > bottomStarts;
}

/**
 * Moves everything one frame further.
 *
 * @param   seconds  How much time passed since the last frame.
 */
function update(seconds) {
  const fieldHeight = game.clientHeight;

  // The bird falls faster and faster, but never faster than BIRD_MAX_FALL.
  birdSpeed = Math.min(birdSpeed + BIRD_GRAVITY * seconds, BIRD_MAX_FALL);
  birdTop = birdTop + birdSpeed * seconds;

  // The ceiling stops the bird instead of killing it.
  if (birdTop < 0) {
    birdTop = 0;
    birdSpeed = 0;
  }

  // The floor is deadly.
  if (birdTop + BIRD_HEIGHT >= fieldHeight) {
    birdTop = fieldHeight - BIRD_HEIGHT;
    drawBird();
    endGame();
    return;
  }

  drawBird();

  for (const pair of christians) {
    pair.left = pair.left - CHRISTIAN_SPEED * seconds;
    drawChristians(pair);

    // One point for every pair the bird leaves behind.
    if (!pair.isPassed && pair.left + CHRISTIAN_WIDTH < BIRD_LEFT) {
      pair.isPassed = true;
      score = score + 1;
      scoreLabel.textContent = score;
    }

    if (hitsChristians(pair)) {
      endGame();
      return;
    }
  }

  // Throw away the pairs that left the screen on the left.
  const gone = christians.filter((pair) => pair.left + CHRISTIAN_WIDTH < 0);
  gone.forEach(removeChristians);
  christians = christians.filter((pair) => pair.left + CHRISTIAN_WIDTH >= 0);

  // As soon as the last pair is far enough inside, send the next one.
  const last = christians[christians.length - 1];
  if (!last || last.left <= game.clientWidth - CHRISTIAN_SPACING) {
    spawnChristians();
  }
}

/**
 * Puts the bird where it currently belongs.
 */
function drawBird() {
  bird.style.top = birdTop + "px";
}

/**
 * Runs one frame and asks the browser for the next one.
 *
 * @param   now  The current time, handed over by the browser.
 */
function loop(now) {
  if (!isRunning) {
    return;
  }

  // On the very first frame there is no previous time to compare with.
  // Capping the step keeps the bird from jumping when the tab was hidden.
  const seconds = Math.min((now - lastFrameTime) / 1000, 0.05);
  lastFrameTime = now;

  update(seconds);

  if (isRunning) {
    requestAnimationFrame(loop);
  }
}

/**
 * Clears the field and puts the bird back to the middle.
 */
function resetGame() {
  christians.forEach(removeChristians);
  christians = [];

  score = 0;
  scoreLabel.textContent = score;

  birdTop = game.clientHeight / 2 - BIRD_HEIGHT / 2;
  birdSpeed = 0;
  drawBird();

  isGameOver = false;
}

/**
 * Starts a fresh round.
 */
function startGame() {
  resetGame();
  spawnChristians();

  message.classList.add("hidden");
  isRunning = true;
  lastFrameTime = performance.now();
  requestAnimationFrame(loop);
}

/**
 * Stops the round and shows the score.
 */
function endGame() {
  isRunning = false;
  isGameOver = true;

  messageTitle.textContent = "Game over";
  messageText.textContent = "Score: " + score + " - press Space to try again";
  message.classList.remove("hidden");
}

/**
 * One flap, or a new round if the last one is already over.
 */
function flap() {
  if (isGameOver || !isRunning) {
    startGame();
  }

  birdSpeed = -BIRD_FLAP_SPEED;
}

// ---------------------------------------------------------------------------
// Events - this is where the game starts.
// ---------------------------------------------------------------------------
document.addEventListener("keydown", function (event) {
  if (event.code !== "Space") {
    return;
  }

  // Space normally scrolls the page, and holding it down repeats the event.
  event.preventDefault();
  if (event.repeat) {
    return;
  }

  flap();
});

// Clicking works too, so the game can be played on a touchpad or a phone.
game.addEventListener("mousedown", flap);

// The field changes size when the window does, so put the bird back inside.
window.addEventListener("resize", function () {
  if (!isRunning && !isGameOver) {
    resetGame();
  }
});

// The bird gets its size and its place from the settings above, not from the
// stylesheet. That way the game still looks right if the CSS fails to load.
bird.style.position = "absolute";
bird.style.left = BIRD_LEFT + "px";
bird.style.width = BIRD_WIDTH + "px";
bird.style.height = BIRD_HEIGHT + "px";

resetGame();
