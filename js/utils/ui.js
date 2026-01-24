import { state } from './gameState.js';

export const livesDisplay = document.getElementById('lives');
export const timerDisplay = document.getElementById('timer');
export const scoreDisplay = document.getElementById('score');
export const startMessage = document.getElementById('start-message');
export const leveldisplay = document.getElementById('level')
export const modal = document.getElementById('game-modal')
export const modalTitle = document.getElementById('modal-title')
export const modalText = document.getElementById('modal-text');
export const modalBtn = document.getElementById('modal-btn');

export function updateTimer() {
    if (state.gameRunning && !state.isPaused) {
        state.timerSecond--;
    }
    let minutes = Math.floor(state.timerSecond / 60);
    let seconds = state.timerSecond % 60;
    let formattedMin = minutes < 10 ? `0${minutes}` : minutes;
    let formattedSec = seconds < 10 ? `0${seconds}` : seconds;
    timerDisplay.innerText = `${formattedMin}:${formattedSec}`;
}

export function displayLives() {
    const gokuLive = '<img src="../images/lives.png" width="30" height="30" style="margin-right: 5px;">';
    livesDisplay.innerHTML = gokuLive.repeat(state.lives);
}

export function updateScore() {
    scoreDisplay.innerText = state.score;
}

export function showMessage(text) {
    startMessage.innerText = text;
    startMessage.style.display = 'block';
}

export function hideMessage() {
    startMessage.style.display = 'none';
}
export function updatelevel() {
    leveldisplay.innerText = `level: ${state.currentLevel}`
}

export function showModal(title, message, btnText, actionCallback) {
    modalText.innerText = message
    modalTitle.innerText = title
    modalBtn.innerText = btnText

    modal.style.display = 'flex'
    modalBtn.onclick = function () {
        modal.style.display = 'none'
             if (actionCallback){
                actionCallback()
             }
            
      
    }
}