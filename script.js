const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const mainMenuButton = document.getElementById('main-menu-button');
const difficultySelect = document.getElementById('difficulty');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const currentHighScoreElement = document.getElementById('current-high-score');
const finalScoreElement = document.getElementById('final-score');
const eatSound = document.getElementById('eat-sound');
const gameOverSound = document.getElementById('game-over-sound');
const snakeIntro = document.getElementById('snake-intro');

const gridSize = 20;
const tileCount = {
    x: canvas.width / gridSize,
    y: canvas.height / gridSize
};

let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameSpeed = 150;
let gameLoop;
let foodColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];

function showScreen(screenId) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
    document.getElementById(screenId).classList.add('fade-in');
}

function startGame() {
    showScreen('game-screen');
    resetGame();
    createFood();
    gameLoop = setInterval(updateGame, gameSpeed);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    updateScore();
    setDifficulty();
}

function setDifficulty() {
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case 'easy':
            gameSpeed = 200;
            break;
        case 'medium':
            gameSpeed = 150;
            break;
        case 'hard':
            gameSpeed = 100;
            break;
    }
}

function createFood() {
    do {
        food = {
            x: Math.floor(Math.random() * tileCount.x),
            y: Math.floor(Math.random() * tileCount.y),
            color: foodColors[Math.floor(Math.random() * foodColors.length)]
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function updateGame() {
    moveSnake();

    if (hasCollided()) {
        endGame();
        return;
    }

    if (hasEatenFood()) {
        score++;
        updateScore();
        createFood();
        eatSound.play();
    } else {
        snake.pop();
    }

    clearCanvas();
    drawFood();
    drawSnake();
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);
}

function hasCollided() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= tileCount.x ||
        head.y < 0 || head.y >= tileCount.y ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function hasEatenFood() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
    currentHighScoreElement.textContent = `High Score: ${highScore}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = `High Score: ${highScore}`;
        currentHighScoreElement.textContent = `High Score: ${highScore}`;
    }
}

function clearCanvas() {
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * gridSize, (food.y + 0.5) * gridSize, gridSize / 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const hue = (index * 10) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        
        if (index === 0) {
            drawSnakeEyes(segment);
        }
    });
}

function drawSnakeEyes(head) {
    ctx.fillStyle = '#ffffff';
    const eyeSize = 3;
    const eyeOffset = 5;

    ctx.beginPath();
    ctx.arc(head.x * gridSize + eyeOffset, head.y * gridSize + eyeOffset, eyeSize, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(head.x * gridSize + gridSize - eyeOffset, head.y * gridSize + eyeOffset, eyeSize, 0, 2 * Math.PI);
    ctx.fill();
}

function endGame() {
    clearInterval(gameLoop);
    gameOverSound.play();
    showScreen('game-over-screen');
    finalScoreElement.textContent = `Your score: ${score}`;
}

function snakeIntroAnimation() {
    const text = "SNAKE!";
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            snakeIntro.textContent += text[i];
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                snakeIntro.classList.add('scale-in');
                snakeIntro.style.transform = 'scale(0)';
                setTimeout(() => {
                    snakeIntro.style.display = 'none';
                }, 300);
            }, 1000);
        }
    }, 200);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
mainMenuButton.addEventListener('click', () => showScreen('main-menu'));

highScoreElement.textContent = `High Score: ${highScore}`;
currentHighScoreElement.textContent = `High Score: ${highScore}`;

snakeIntroAnimation();
