const grid = document.querySelector(".grid");
const dino = document.createElement("div");
const score = document.createElement("div");
const gameOverText = document.querySelector(".over");
const background = document.getElementById("background");
let ctx = background.getContext("2d");
background.width = 1000;
background.height = 200;
let img = new Image();
img.src = "t-rex-background.png";

let bottomSpace = 0;
let dinoLeftSpace = 20;

let upTimerId;
let downTimerId;
let isJump = false;
let isOver = false;

let scoreTimerId;

//move background
function createBackground() {
  let imgWidth = 1000;
  let scrollSpeed = 8;
  function loop() {
    ctx.drawImage(img, imgWidth - 525, 0); //注意图片本身的尺寸
    ctx.drawImage(img, imgWidth - background.width, 0);

    imgWidth -= scrollSpeed;
    if (imgWidth == 0) imgWidth = background.width;
    if (!isOver) {
      window.requestAnimationFrame(loop);
    }
    if (isOver) {
      window.cancelAnimationFrame(loop);
    }
  }

  loop();
}

//create scoreboard
function createScoreBoard() {
  grid.appendChild(score);
  score.classList.add("score");
  score.innerText = "Score" + " 0";
  score.style.left = 20 + "px";
  score.style.top = 10 + "px";
}

//create dinosaur
function createDino() {
  grid.appendChild(dino);
  dino.classList.add("dino");
  dino.style.bottom = bottomSpace + "px";
  dino.style.left = dinoLeftSpace + "px";
}

//create cactus
//cactusLeftSpace必须为函数内部变量，如果是全局变量的话，
//在回调函数的时候，cactusLeftSpace的值会不断刷新；
//appendChild同一个变量的话不会增加新的节点
function createCactus() {
  let cactusLeftSpace = 1000;
  let randomTime = Math.random() * 5000;

  const cactus = document.createElement("div");
  grid.appendChild(cactus);
  cactus.classList.add("cacti");
  cactus.style.bottom = 0;
  cactus.style.left = cactusLeftSpace + "px";

  let timerId = setInterval(function () {
    if (cactusLeftSpace === 0) {
      clearInterval(timerId);
      grid.removeChild(grid.lastChild);
    }
    if (dinoLeftSpace + 50 === cactusLeftSpace && bottomSpace <= 40) {
      gameOver();
      clearInterval(timerId);
    }
    cactusLeftSpace -= 10;
    cactus.style.left = cactusLeftSpace + "px";
  }, 25);
  if (!isOver) {
    setTimeout(createCactus, randomTime);
  }
  if (isOver) {
    grid.removeChild(grid.lastChild); //确保游戏结束时不会有新的仙人掌
    clearTimeout(createCactus);
  }
}

function gameOver() {
  isOver = true;
  gameOverText.style.opacity = "1";
  clearInterval(scoreTimerId);
}

function control(e) {
  if (e.keyCode === 32) {
    if (!isJump) {
      isJump = true;
      jump();
    }
  }
}

function jump() {
  if (isJump) {
    clearInterval(downTimerId);
    upTimerId = setInterval(function () {
      bottomSpace += 2;
      dino.style.bottom = bottomSpace + "px";
      if (bottomSpace > 100) {
        fall();
      }
    }, 5);
  }
}

function fall() {
  clearInterval(upTimerId);
  downTimerId = setInterval(function () {
    isJump = false;
    bottomSpace -= 2;
    dino.style.bottom = bottomSpace + "px";
    if (bottomSpace < 0) {
      bottomSpace = 0;
      dino.style.bottom = 0;
    }
  }, 5);
}
//Count Score
function countScore() {
  let second = 0;

  scoreTimerId = setInterval(() => {
    second += 1;
    score.innerText = "Score  " + second;
  }, 1000);
}
function start() {
  if (!isOver) {
    createDino();
    createScoreBoard();

    createBackground();
    createCactus();
    document.addEventListener("keyup", control); //是对整个文档加监听器
    jump();
    countScore();
  }
}
start();
