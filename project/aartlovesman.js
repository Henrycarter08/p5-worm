let snake;
let food;
let obstacles = [];
let gridSize = 20;
let cols, rows;
let gameOver = false;
let score = 0;            // <-- New
let highScore = 0;        // <-- New

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(10);
    calculateGrid();
    snake = new Snake();
    food = createFood();
    generateObstacles(30);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calculateGrid();
    restartGame();
}

function calculateGrid() {
    cols = floor(width / gridSize);
    rows = floor(height / gridSize);
}

function draw() {
    background(51);

    if (gameOver) {
        showGameOver();
        return;
    }

    // Draw obstacles
    fill(200, 100, 0);
    for (let obs of obstacles) {
        rect(obs.x, obs.y, gridSize, gridSize);
    }

    snake.update();
    snake.show();

    if (snake.eat(food)) {
        score += 10;               // <-- New
        food = createFood();
    }

    fill(255, 0, 100);
    rect(food.x, food.y, gridSize, gridSize);

    // Draw score
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 10, 10);             // <-- New
    text(`High Score: ${highScore}`, 10, 35);    // <-- New
}

function keyPressed() {
    if (gameOver) {
        restartGame();
        return;
    }

    if (keyCode === UP_ARROW && snake.ydir !== 1) {
        snake.setDir(0, -1);
    } else if (keyCode === DOWN_ARROW && snake.ydir !== -1) {
        snake.setDir(0, 1);
    } else if (keyCode === LEFT_ARROW && snake.xdir !== 1) {
        snake.setDir(-1, 0);
    } else if (keyCode === RIGHT_ARROW && snake.xdir !== -1) {
        snake.setDir(1, 0);
    }
}

function showGameOver() {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(48);
    text("💀 GAME OVER 💀", width / 2, height / 2 - 40);
    textSize(24);
    text("Press any key to restart", width / 2, height / 2 + 20);
}

function restartGame() {
    if (score > highScore) highScore = score;  // <-- New
    score = 0;                                 // <-- New
    gameOver = false;
    snake.reset();
    food = createFood();
    generateObstacles(30);
}

function createFood() {
    let pos;
    do {
        let x = floor(random(cols)) * gridSize;
        let y = floor(random(rows)) * gridSize;
        pos = createVector(x, y);
    } while (isOccupied(pos));
    return pos;
}

function generateObstacles(count) {
    obstacles = [];
    while (obstacles.length < count) {
        let x = floor(random(cols)) * gridSize;
        let y = floor(random(rows)) * gridSize;
        let pos = createVector(x, y);

        if (!isOccupied(pos)) {
            obstacles.push(pos);
        }
    }
}

function isOccupied(pos) {
    for (let s of snake.body) {
        if (s.x === pos.x && s.y === pos.y) return true;
    }
    if (food && pos.x === food.x && pos.y === food.y) return true;
    for (let o of obstacles) {
        if (o.x === pos.x && o.y === pos.y) return true;
    }
    return false;
}

// Snake class
class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        this.body = [];
        this.body[0] = createVector(floor(width / 2 / gridSize) * gridSize, floor(height / 2 / gridSize) * gridSize);
        this.xdir = 0;
        this.ydir = 0;
        this.len = 1;
    }

    setDir(x, y) {
        this.xdir = x;
        this.ydir = y;
    }

    update() {
        let head = this.body[this.body.length - 1].copy();
        head.x += this.xdir * gridSize;
        head.y += this.ydir * gridSize;

        for (let i = 0; i < this.body.length - 1; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                gameOver = true;
                return;
            }
        }

        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
            gameOver = true;
            return;
        }

        for (let o of obstacles) {
            if (head.x === o.x && head.y === o.y) {
                gameOver = true;
                return;
            }
        }

        this.body.shift();
        this.body.push(head);
    }

    grow() {
        let head = this.body[this.body.length - 1].copy();
        this.len++;
        this.body.push(head);
    }

    eat(pos) {
        let head = this.body[this.body.length - 1];
        if (head.x === pos.x && head.y === pos.y) {
            this.grow();
            return true;
        }
        return false;
    }

    show() {
        for (let i = 0; i < this.body.length; i++) {
            fill(0, 255, 0);
            noStroke();
            rect(this.body[i].x, this.body[i].y, gridSize, gridSize);
        }
    }
}
