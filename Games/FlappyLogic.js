/*
const christianPipe = document.querySelector("#ChristianPipe");
christianPipe.style.position = "absolute";
christianPipe.style.left = "50%";
christianPipe.style.top = "10%";

async function moveChristianPipe() {
  while (true) {
    await sleep(10);
    christianPipe.style.left = christianPipe.offsetLeft - 2 + "px";
  } 
}

moveChristianPipe();
*/

function spawnChristiansPipes() {
  const LowestChristian = 80;
  const HighestChristian = 45;

  const DoubleChristHight =
    Math.floor(Math.random() * (LowestChristian - HighestChristian + 1)) +
    HighestChristian;

  const ChristianTop = document.createElement("img");
  ChristianTop.src = "./../GameAssests/FlappyBird/christi.png";
  ChristianTop.style.position = "absolute";
  ChristianTop.style.left = "75vw";
  ChristianTop.style.top = DoubleChristHight - 75 + "vh";
  ChristianTop.id = "ChristianTopPipe";
  ChristianTop.style.rotate = "180deg";
  ChristianTop.style.transform = "scaleX(-1)";
  let ChristianTopElement = document.body.appendChild(ChristianTop);

  const ChristianBot = document.createElement("img");
  ChristianBot.src = "./../GameAssests/FlappyBird/christi.png";
  ChristianBot.style.position = "absolute";
  ChristianBot.style.left = "75vw";
  ChristianBot.style.top = DoubleChristHight + "vh";
  ChristianBot.id = "ChristianBottomPipe";
  let ChristianBotElement = document.body.appendChild(ChristianBot);


}

document.addEventListener("DOMContentLoaded", function () {
  spawnChristiansPipes();
});
