// Ball class
class Ball {
    constructor(radius, canvas) {
        this.radius = radius;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.dx = 2;
        this.dy = -2;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.checkWallCollision();
    }

    checkWallCollision() {
        if (this.x + this.dx > this.canvas.width - this.radius || this.x + this.dx < this.radius) {
            this.dx = -this.dx;
        }
     }
}

// Paddle class
class Paddle {
    constructor(width, height, canvas) {
        this.width = width;
        this.height = height;
        this.x = (canvas.width - width) / 2;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        document.addEventListener("mousemove", this.mouseMoveHandler.bind(this), false);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.canvas.height - this.height, this.width, this.height);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    mouseMoveHandler(e) {
        const relativeX = e.clientX - this.canvas.offsetLeft;
        if (relativeX > 0 && relativeX < this.canvas.width) {
            this.x = relativeX - this.width / 2;
        }
    }
}

// Brick class
class Brick {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.status = 1;
    }

    draw(ctx) {
        if (this.status == 1) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }

    collision(ball) {
        if (this.status == 1) {
            if (ball.x > this.x && ball.x < this.x + this.width && ball.y > this.y && ball.y < this.y + this.height) {
                ball.dy = -ball.dy;
                this.status = 0;
            }
        }
    }
}

// Game class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ball = new Ball(10, canvas);
        this.paddle = new Paddle(75, 18, canvas);
        this.bricks = this.createBricks();
        this.isGameOver = false;
    }

    createBricks() {
        const brickRowCount = 3;
        const brickColumnCount = 5;
        const brickWidth = 75;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 30;
        const brickOffsetLeft = 30;

        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r] = new Brick(brickX, brickY, brickWidth, brickHeight);
            }
        }
        return bricks;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.draw();
        this.paddle.draw();
        this.bricks.flat().forEach(brick => brick.draw(this.ctx));
        this.checkCollisions();
    }

    update() {
        this.ball.update();
        this.checkPaddleCollision();
        if (this.isGameOver) {
            alert("Game Over");
            document.location.reload();
        }
    }

    checkPaddleCollision() {
        if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
            if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
                this.ball.dy = -this.ball.dy;
            } else {
                this.isGameOver = true;
            }
        }
    }

    checkCollisions() {
        this.bricks.flat().forEach(brick => brick.collision(this.ball));
    }

    run() {
        setInterval(() => {
            this.draw();
            this.update();
        }, 10);
    }
}

// Initialize the game
const canvas = document.getElementById("myCanvas2");
const game = new Game(canvas);
game.run();

