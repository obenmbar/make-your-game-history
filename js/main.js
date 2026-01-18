
import { state } from './gameState.js';
import * as UI from './ui.js';
import * as Physics from './physics.js';
import * as Entities from './entities.js';
import { PADDLE_SPEED } from './constants.js';

const gameArea = document.getElementById('game-area');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const brickContainer = document.getElementById('bricks-container');


Entities.initBricks(gameArea.clientWidth, brickContainer);
Entities.resetPositions(ball, paddle, gameArea.clientWidth, gameArea.clientHeight);
UI.displayLives();


function handleResetSequence() {
    state.gameRunning = false;
    state.isResetting = true;
 
    Entities.resetPositions(ball, paddle, gameArea.clientWidth, gameArea.clientHeight);
    

    UI.showMessage("Ready? 3...");
    
    setTimeout(() => {
        UI.showMessage("Set... 2...");
    }, 1000);

    setTimeout(() => {
        UI.showMessage("Go! 1...");
    }, 2000);

    setTimeout(() => {
        UI.hideMessage();
        state.gameRunning = true;
        state.isResetting = false; 

        state.ballSpeedY = -Math.abs(state.ballSpeedY); 
    }, 3000);
}



document.addEventListener('keydown', (e) => {

    if (state.isResetting) return;

    if (e.key === 'ArrowRight') state.rightPressed = true;
    if (e.key === 'ArrowLeft') state.leftPressed = true;

    if (e.code === 'Space' && !state.gameRunning && !state.isResetting) {

        handleResetSequence();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') state.rightPressed = false;
    if (e.key === 'ArrowLeft') state.leftPressed = false;
});

window.addEventListener('resize', () => {
    if (!state.gameRunning) {
        Entities.initBricks(gameArea.clientWidth, brickContainer);
        Entities.resetPositions(ball, paddle, gameArea.clientWidth, gameArea.clientHeight);
    }
});


function gameLoop() {
    

    if (!state.isResetting) {
        if (state.rightPressed && state.currentPaddleX < gameArea.clientWidth - paddle.offsetWidth) {
            state.currentPaddleX += PADDLE_SPEED;
        } else if (state.leftPressed && state.currentPaddleX > 0) {
            state.currentPaddleX -= PADDLE_SPEED;
        }
        paddle.style.transform = `translateX(${state.currentPaddleX}px)`;
    }

    if (!state.gameRunning) {
        state.ballX = state.currentPaddleX + (paddle.offsetWidth / 2) - (ball.offsetWidth / 2);
        ball.style.transform = `translate(${state.ballX}px, ${state.ballY}px)`;
    }

   
    if (state.gameRunning) {
        state.ballX += state.ballSpeedX;
        state.ballY += state.ballSpeedY;

        
        if (state.ballX + ball.offsetWidth >= gameArea.clientWidth || state.ballX <= 0) {
            state.ballSpeedX *= -1;
        }
        if (state.ballY <= 0) {
            state.ballSpeedY *= -1;
        }

        Physics.handleBallPaddleCollision(paddle.offsetTop, state.currentPaddleX, paddle.offsetWidth, ball.offsetWidth);
        Physics.detectCollision(ball.offsetWidth);

        if (state.ballY + ball.offsetWidth >= gameArea.clientHeight) {
            state.lives--;
            UI.displayLives();

            if (state.lives === 0) {
                alert('Game Over 😢');
                document.location.reload();
            } else {
            
                handleResetSequence(); 
            }
        }

        ball.style.transform = `translate(${state.ballX}px, ${state.ballY}px)`;
    }

    requestAnimationFrame(gameLoop);
}

setInterval(UI.updateTimer, 1000);
gameLoop();