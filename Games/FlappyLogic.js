/**
 * Slleps for a given amount of milisecs.
 *
 * @param   ms  The amount of milisecs to sleep.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function spawnChristiansPipes() {
  const LowestChristian = 80;
  const HighestChristian = 45;

  const DoubleChristHeight =
    Math.floor(Math.random() * (LowestChristian - HighestChristian + 1)) +
    HighestChristian;

  const ChristianTop = document.createElement("img");
  ChristianTop.src = "./../GameAssests/FlappyBird/christi.png";
  ChristianTop.style.position = "absolute";
  ChristianTop.style.left = "75vw";
  ChristianTop.style.top = DoubleChristHeight - 75 + "vh";
  ChristianTop.id = "ChristianTopPipe";
  ChristianTop.style.rotate = "180deg";
  ChristianTop.style.transform = "scaleX(-1)";
  let ChristianTopElement = document.body.appendChild(ChristianTop);

  const ChristianBot = document.createElement("img");
  ChristianBot.src = "./../GameAssests/FlappyBird/christi.png";
  ChristianBot.style.position = "absolute";
  ChristianBot.style.left = "75vw";
  ChristianBot.style.top = DoubleChristHeight + "vh";
  ChristianBot.id = "ChristianBottomPipe";
  let ChristianBotElement = document.body.appendChild(ChristianBot);
}

async function moveChristianPipes() {
  const ChristianTop = document.getElementById("ChristianTopPipe");
  const ChristianBot = document.getElementById("ChristianBottomPipe");
  while (ChristianBot.offsetLeft + ChristianBot.clientWidth > 0) {
    await sleep(10);
    ChristianTop.style.left = ChristianTop.offsetLeft - 2 + "px";
    ChristianBot.style.left = ChristianBot.offsetLeft - 2 + "px";
  }
  ChristianBot.remove();
  ChristianTop.remove();
  spawnChristiansPipes();
  moveChristianPipes();
  spawnChristiansPipes();
  moveChristianPipes();
}

async function dropbird() {
  const bird = document.getElementById("bird_img");
  let isSpacePressed = false;
  
  document.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
      isSpacePressed = true;
    }
  });
  
  document.addEventListener('keyup', (e) => {
    if (e.code === "Space") {
      isSpacePressed = false;
    }
  });
  
  while(bird.offsetTop + bird.clientHeight > 0) {
    await sleep(20);
    if (isSpacePressed) {
      bird.style.top = bird.offsetTop - 10 + "px";
    } else {
      bird.style.top = bird.offsetTop + 10 + "px";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  spawnChristiansPipes();
  moveChristianPipes();
  dropbird();
});