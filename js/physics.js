


import { state } from './gameState.js';

import { BRICK_WIDTH, BRICK_HEIGHT, BRICK_ROW_COUNT } from './constants.js';
import { updateScore, updatelevel } from './ui.js';
import { initBricks, resetPositions } from './entities.js';
import { handleResetSequence } from './main.js'
const gameArea = document.getElementById('game-area');
const brickContainer = document.getElementById('bricks-container');
const ball = document.getElementById('ball');
const paddle = document.getElementById('paddle');

export function detectCollision(ballWidth) {

    for (let c = 0; c < state.brickColumnCount; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {


            let b = state.bricks[c][r];


            if (b.status > 0) {

                if (
                    state.ballX + ballWidth > b.x &&
                    state.ballX < b.x + BRICK_WIDTH &&
                    state.ballY + ballWidth > b.y &&
                    state.ballY < b.y + BRICK_HEIGHT
                ) {

                    let overlapLeft = (state.ballX + ballWidth) - b.x;
                    let overlapRight = (b.x + BRICK_WIDTH) - state.ballX;
                    let overlapTop = (state.ballY + ballWidth) - b.y;
                    let overlapBottom = (b.y + BRICK_HEIGHT) - state.ballY;


                    if (overlapLeft < overlapBottom && overlapLeft < overlapRight && overlapLeft < overlapTop) {
                        state.ballSpeedX = -Math.abs(state.ballSpeedX);
                    } else if (overlapRight < overlapTop && overlapRight < overlapBottom && overlapRight < overlapLeft) {
                        state.ballSpeedX = Math.abs(state.ballSpeedX);
                    } else {
                        state.ballSpeedY *= -1;
                    }


                    b.status--;


                    const brickElement = document.getElementById(`brick${c}-${r}`);
                    if (brickElement) {
                        if (b.status === 0) {
                            brickElement.style.display = 'none';
                            state.totalbrick++
                        } else if (b.status === 1) {
                            brickElement.className = 'brick'
                        } else {
                            brickElement.className = 'brick-metal'
                        }
                    }


                    state.score++;
                    updateScore();

                    const totalBricks = state.brickColumnCount * BRICK_ROW_COUNT;
                    if (totalBricks === state.totalbrick) {
                        if (state.currentLevel < 3) {
                            state.currentLevel++;
                            updatelevel();

                            initBricks(gameArea.clientWidth, brickContainer);


                            let baseSpeed = Math.abs(state.ballSpeedY) * 1.2;
                            state.ballSpeedY = -baseSpeed;
                            state.ballSpeedX *= 1.2;

                            if (state.currentLevel === 2) state.timerSecond = 200;
                            if (state.currentLevel === 3) state.timerSecond = 260;

                          

                            resetPositions(ball, paddle, gameArea.clientWidth, gameArea.clientHeight);
                            handleResetSequence(true)
                        } else {
                            state.gameRunning = false;
                            alert('"YOU WIN! BRAVO 3LIK! 🎉"');
                            document.location.reload();
                        }

                        state.totalbrick = 0
                    }
                    return;
                }
            }
        }
    }
}


export function handleBallPaddleCollision(paddleTopEdge, currentPaddleX, paddleWidth, ballWidth) {


    if (
        state.ballY + ballWidth >= paddleTopEdge &&
        state.ballX + ballWidth >= currentPaddleX &&
        state.ballX <= currentPaddleX + paddleWidth
    ) {

        state.ballSpeedY = -Math.abs(state.ballSpeedY);


        let paddleCenter = currentPaddleX + (paddleWidth / 2);
        let ballCenter = state.ballX + (ballWidth / 2);
        let impactPoint = ballCenter - paddleCenter;


        state.ballSpeedX = impactPoint * 0.2;

        if (state.ballSpeedX > 10) state.ballSpeedX = 10;
        if (state.ballSpeedX < -10) state.ballSpeedX = -10;
    }
}