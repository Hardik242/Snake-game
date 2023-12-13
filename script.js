let gameStartSound = new Audio("assets/game-start-sound.mp3");
let bgMusic = new Audio("assets/bg-music.mp3");
let foodEatenSound = new Audio("assets/food-eaten.mp3");
let gameOverSound = new Audio("assets/game-over.mp3");

let gameStartScreen = document.querySelector(".game-start");
let gameOverScreen = document.querySelector(".game-over");
let currentScoreSpan = document.querySelector(".crnt-score");
let highScoreSpan = document.querySelector(".high-score");
let board = document.querySelector(".board");

let direction = {
    x: 0,
    y: 0,
};
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{x: 13, y: 13}];
let food = {
    x: Math.floor(Math.random() * (22 - 1) + 1),
    y: Math.floor(Math.random() * (22 - 1) + 1),
};
let inputDir = {x: 0, y: -1};
let isGameOver = false;
let score = 0;
let times = 1;

window.onload = audioPlay(gameStartSound);

function audioPause(sound) {
    sound.pause();
    sound.currentTime = 0;
}

function gameStartClick() {
    audioPause(gameStartSound);
    gameStartScreen.hidden = true;
    gameOverScreen.hidden = true;
    audioPlay(bgMusic);
    bgMusic.loop = true;
    isGameOver = false;
    mainStart();
}

function audioPlay(sound) {
    sound.volume = 0.3;
    sound.play();
}

function gameOverSoundPlay() {
    audioPause(bgMusic);
    audioPlay(gameOverSound);
    gameOverSound.loop = false;
}

//Check the collision
function isCollide(snake) {
    // If you bump into yourself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (
        snake[0].x >= 22 ||
        snake[0].x <= 0 ||
        snake[0].y >= 22 ||
        snake[0].y <= 0
    ) {
        return true;
    }

    return false;
}

function gameOver() {
    gameOverSoundPlay();
    gameOverScreen.hidden = false;
    isGameOver = true;
}

function gameEngine() {
    // Part 1 Updating snake and food

    //On the collision
    if (isCollide(snakeArr)) {
        gameOver();
        inputDir = {x: 0, y: -1};
        snakeArr = [{x: 13, y: 13}];
        food = {
            x: Math.floor(Math.random() * (22 - 2) + 2),
            y: Math.floor(Math.random() * (22 - 2) + 2),
        };
        score = 0;
        return;
    }

    // If food eaten update score, food and snake
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        food = {
            x: Math.floor(Math.random() * (22 - 2) + 2),
            y: Math.floor(Math.random() * (22 - 2) + 2),
        };
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y,
        });
        foodEatenSound.play();
        foodEatenSound.loop = false;
        score += 1;
    }

    //Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = {...snakeArr[i]};
    }

    //Moving the snake head
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2 Displaying snake and food
    board.innerHTML = `<div class="score">
        <div>
            Score: <span class="crnt-score">${score}</span>
        </div>
    </div>`;
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        if (index === 0) {
            snakeElement.classList.add("snake-head");
        } else {
            snakeElement.classList.add("snake-body");
        }
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement("div");
    foodElement.classList.add("food");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    board.appendChild(foodElement);
}

function mainStart(ctime) {
    if (isGameOver) {
        window.addEventListener("keydown", (e) => {
            window.location.reload();
        });
        return;
    }
    if (snakeArr.length > times * 3) {
        speed += 0.5;
        times++;
    }
    window.requestAnimationFrame(mainStart);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

//Click on start game
gameStartScreen.onclick = gameStartClick;

//adding events on key press
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            console.log("key pressed");
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            console.log("key pressed");
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            console.log("key pressed");
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            console.log("key pressed");
            break;

        default:
            break;
    }
});
