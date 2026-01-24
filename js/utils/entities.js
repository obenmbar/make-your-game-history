

import { state } from './gameState.js';
import {
    BRICK_ROW_COUNT,
    BRICK_WIDTH,
    BRICK_HEIGHT,
    BRICK_PADDING,
    BRICK_OFFSET_TOP
} from './constants.js';


export function initBricks(gameWidth, brickContainer) {

    state.brickColumnCount = Math.floor(gameWidth / (BRICK_WIDTH + BRICK_PADDING));


    let totalBrickWidth = state.brickColumnCount * (BRICK_WIDTH + BRICK_PADDING) - BRICK_PADDING;
    let brickOffsetLeft = (gameWidth - totalBrickWidth) / 2;


    state.bricks = [];
    brickContainer.innerHTML = '';


    for (let c = 0; c < state.brickColumnCount; c++) {
        state.bricks[c] = [];

        for (let r = 0; r < BRICK_ROW_COUNT; r++) {


            let bX = c * (BRICK_WIDTH + BRICK_PADDING) + brickOffsetLeft;
            let bY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;

            let hp = 1
            if (state.currentLevel === 2) {
                if ((c + r) % 2 === 0) {
                    hp = 2
                } 
            }else if (state.currentLevel === 3) {
                    if (r === 0) {
                        hp = 3
                    } else if (r === 1 || r === 2) {
                        if (c % 2===0) hp = 2
                    }
                }



            const brickHtml = document.createElement('div');
            brickHtml.classList.add('brick');
            if (hp === 2) {
                brickHtml.classList.add('brick-metal');
            } else if (hp === 3) {
                brickHtml.classList.add('brick-super');
            }

            brickHtml.id = `brick${c}-${r}`
            brickHtml.style.left = bX + 'px';
            brickHtml.style.top = bY + 'px';
            brickHtml.style.width = BRICK_WIDTH + 'px';
            brickHtml.style.height = BRICK_HEIGHT + 'px';

           state.bricks[c][r] = { x: bX, y: bY, status: hp,element:brickHtml};

            brickContainer.appendChild(brickHtml);

        }
    }
}


export function resetPositions(ball, paddle, gameWidth, gameHeight) {


    let paddleWidth = paddle.offsetWidth;
    let paddleHeight = paddle.clientHeight;
    let ballWidth = ball.offsetWidth;


    let startPosition = (gameWidth - paddleWidth) / 2;


    state.currentPaddleX = startPosition;
    state.ballX = startPosition + paddleWidth / 2 - ballWidth / 2;
    state.ballY = gameHeight - paddleHeight - ballWidth - 20;


    state.ballSpeedX = 4;
    state.ballSpeedY = -4;

    paddle.style.transform = `translateX(${state.currentPaddleX}px)`;
    ball.style.transform = `translate(${state.ballX}px, ${state.ballY}px)`;
}