


import { state, } from './gameState.js';

import { BRICK_WIDTH, BRICK_HEIGHT, BRICK_ROW_COUNT, STORY } from './constants.js';
import { updateScore, updatelevel, showModal } from './ui.js';
import { initBricks, resetPositions } from './entities.js';

const gameArea = document.getElementById('game-area');
const brickContainer = document.getElementById('bricks-container');
const ball = document.getElementById('ball');
const paddle = document.getElementById('paddle');
const startmessege =  document.getElementById('start-message')
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


                    const brickElement = b.element
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
                        state.gameRunning = false;
                        state.showstory = false;
                        state.totalbrick = 0;
                      
                            if (state.currentLevel < 3) {

                                state.currentLevel++;
                                updatelevel();

                                let baseSpeed = Math.abs(state.ballSpeedY) * 1.2;
                                state.ballSpeedY = -baseSpeed;
                                state.ballSpeedX *= 1.2;

                                if (state.currentLevel === 2) state.timerSecond = 260;
                                if (state.currentLevel === 3) state.timerSecond = 320;

                                initBricks(gameArea.clientWidth, brickContainer);
                                resetPositions(ball, paddle, gameArea.clientWidth, gameArea.clientHeight);

                                let nextStory;
                                if (state.currentLevel === 2) nextStory = STORY.LEVEL2;
                                else if (state.currentLevel === 3) nextStory = STORY.LEVEL3;

                                showModal(
                                    nextStory.title,
                                    nextStory.text,
                                    nextStory.btn,
                                    () => {
                                        state.showstory = true;


                                        startmessege.style.display = 'block';
                                        startmessege.innerText = `Press Space to Start Level ${state.currentLevel}` 
                                    }
                                );

                            } else {
                                showModal(
                                    STORY.WIN.title,
                                    STORY.WIN.text,
                                    STORY.WIN.btn,
                                    () => document.location.reload()
                                );
                            }
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