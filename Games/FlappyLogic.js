function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
