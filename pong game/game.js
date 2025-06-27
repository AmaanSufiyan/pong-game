const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Paddle settings
const paddleWidth = 12;
const paddleHeight = 90;
const playerX = 20;
const aiX = canvas.width - 20 - paddleWidth;

// Ball settings
const ballRadius = 10;

// Game objects
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);

// Scores (optional, not displayed in this simple version)
let playerScore = 0;
let aiScore = 0;

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawNet() {
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([8, 16]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    clearCanvas();
    drawNet();
    // Draw paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#fff");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#fff");
    // Draw ball
    drawCircle(ballX, ballY, ballRadius, "#fff");
}

function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision (top and bottom)
    if (ballY - ballRadius < 0) {
        ballY = ballRadius;
        ballSpeedY = -ballSpeedY;
    }
    if (ballY + ballRadius > canvas.height) {
        ballY = canvas.height - ballRadius;
        ballSpeedY = -ballSpeedY;
    }

    // Paddle collision (player)
    if (
        ballX - ballRadius < playerX + paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballX = playerX + paddleWidth + ballRadius; // Prevent sticking
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where the ball hits the paddle
        let collidePoint = ballY - (playerY + paddleHeight / 2);
        ballSpeedY += collidePoint * 0.25;
    }

    // Paddle collision (AI)
    if (
        ballX + ballRadius > aiX &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballX = aiX - ballRadius; // Prevent sticking
        ballSpeedX = -ballSpeedX;
        let collidePoint = ballY - (aiY + paddleHeight / 2);
        ballSpeedY += collidePoint * 0.25;
    }

    // Score check
    if (ballX - ballRadius < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement (basic)
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - 20) {
        aiY += 6;
    } else if (aiCenter > ballY + 20) {
        aiY -= 6;
    }
    // Stay within bounds
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function (evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    // Keep paddle within bounds
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();