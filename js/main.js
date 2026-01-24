
import { state } from './utils/gameState.js';
import * as UI from './utils/ui.js';
import * as Physics from './utils/physics.js';
import * as Entities from './utils/entities.js';
import { PADDLE_SPEED, STORY } from './utils/constants.js';

export const gameArea = document.getElementById('game-area');
export const paddle = document.getElementById('paddle');
export const ball = document.getElementById('ball');
export const brickContainer = document.getElementById('bricks-container');
export const conpausediv = document.getElementById('pause_continue_messege')

Entities.initBricks(gameArea.clientWidth, brickContainer);
Entities.resetPositions(ball, paddle, gameArea.clientWidth, gameArea.clientHeight);
UI.displayLives();
UI.updatelevel()

window.onload = () => {
    UI.showModal(
        STORY.INTRO.title,
        STORY.INTRO.text,
        STORY.INTRO.btn,
        () => {
         UI.modal.style.display = 'none'
          state.showstory = true
        }
    );
};


export function handleResetSequence(isNewLevel = false) {
    state.gameRunning = false;
    state.isResetting = true;

    Entities.resetPositions(ball, paddle, gameArea.clientWidth, gameArea.clientHeight);

    if (isNewLevel) {
        UI.showMessage(`level:${state.currentLevel}`);
    } else {
        UI.showMessage(`READY?`);
    }

    setTimeout(() => {
        UI.showMessage("3...");
    }, 1000);

    setTimeout(() => {
        UI.showMessage("2...");
    }, 2000);

    setTimeout(() => {
        UI.showMessage("1...");
    }, 3000);

    setTimeout(() => {
        UI.hideMessage();
        state.gameRunning = true;
        state.isResetting = false;

        state.ballSpeedY = -Math.abs(state.ballSpeedY);
    }, 4000);
}



document.addEventListener('keydown', (e) => {

    if (state.isResetting) return;
    if(!state.showstory)return;

    if (e.key === 'ArrowRight' || e.code === 'KeyD') state.rightPressed = true;
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') state.leftPressed = true;

    if (e.code === 'Space') {

        if (!state.gameRunning && !state.isResetting && state.showstory) {
            handleResetSequence(true);
            conpausediv.style.display = 'block'
            conpausediv.innerText = 'Press Space to Pause'
        } else {
            state.isPaused = !state.isPaused

            if (state.isPaused && state.showstory) {
                conpausediv.innerText = 'Press Space to Continue'
            } else if(state.showstory) {
                conpausediv.innerText = 'Press Space to Pause'

            }
        }

    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.code === 'KeyD') state.rightPressed = false;
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') state.leftPressed = false;
});

window.addEventListener('resize', () => {
    if (!state.gameRunning) {
        Entities.initBricks(gameArea.clientWidth, brickContainer);
        Entities.resetPositions(ball, paddle, gameArea.clientWidth, gameArea.clientHeight);
    }
});


function gameLoop() {
    if (!state.isPaused) {


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
                if (state.ballX <= 0) {
                    state.ballX = 0;
                } else {
                    state.ballX = gameArea.clientWidth - ball.offsetWidth
                }

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
                    state.gameRunning = false,
                    state.showstory = false
                        UI.showModal(
                              STORY.LOSE.title,
                              STORY.LOSE.text,
                              STORY.LOSE.btn,
                        ()=>{
                            document.location.reload()
                 
                        }
                        );
                } else {

                    handleResetSequence();
                }
            } else if (state.timerSecond === 0) {
                state.gameRunning = false;
                state.showstory= false

                UI.showModal(
                   STORY.TIMEOUT.title,
                   STORY.TIMEOUT.text,
                   STORY.TIMEOUT.btn,
                    () => {
                        document.location.reload()
              
                    }
                );
            }

            ball.style.transform = `translate(${state.ballX}px, ${state.ballY}px)`;
        }
    }
    requestAnimationFrame(gameLoop);
}

setInterval(UI.updateTimer, 1000);
requestAnimationFrame(gameLoop)