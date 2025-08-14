const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const volumeControl = document.getElementById('volumeControl');
const audioPlayer = document.getElementById('audioPlayer');
const timer = document.querySelector('.timer');




// functions 
function playsong(filePath) {
    audioPlayer.src = filePath;
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    updateTimer();
}


function updateTimer() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    const formattedTime = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    timer.textContent = formattedTime;
    if (duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
    } else {
        progressBar.value = 0;
    }
}
audioPlayer.addEventListener('timeupdate', updateTimer);








// Event Listeners



playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
})



