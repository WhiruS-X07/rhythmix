const playPauseBtn = document.getElementById('playBtn');
const repearBtn = document.getElementById('repeatBtn');
const progressBar = document.getElementById('progress');
const audioPlayer = document.getElementById('audioPlayer');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const player = document.querySelector('.player');


let smoothTime = 0;


function playFromButton(btn) {
    playsong(btn.dataset.file, btn.dataset.title, btn.dataset.artist);
}

function noAudio() {
    if (audioPlayer.src === "") {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        progressBar.style.width = "0%";
        playBtn.disabled = true;
    }
    else {
        playBtn.disabled = false;
    }
}

function truncateText(text, maxLength = 13) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}

function playsong(filePath, titleName, artistName) {
    audioPlayer.src = filePath;
    audioPlayer.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

    progressBar.style.width = "0%";
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    player.classList.remove('hidden');
    title.textContent = truncateText(titleName);
    artist.textContent = artistName;

    audioPlayer.addEventListener('loadedmetadata', () => {
        const durationTime = audioPlayer.duration;
        duration.textContent = formatTime(durationTime);
    })

    smoothTime = 0;
    requestAnimationFrame(updateProgress);


}


dragEln(player);

function dragEln(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        // save mouse position and element position
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = el.offsetLeft;
        initialTop = el.offsetTop;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        // calculate how far the mouse moved since mousedown
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        // set new position based on initial position + delta
        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // ✅ keep inside screen
        const maxTop = window.innerHeight - el.offsetHeight;
        const maxLeft = window.innerWidth - el.offsetWidth;

        if (newTop < 0) newTop = 0;
        if (newLeft < 0) newLeft = 0;
        if (newTop > maxTop) newTop = maxTop;
        if (newLeft > maxLeft) newLeft = maxLeft;

        el.style.top = newTop + "px";
        el.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        requestAnimationFrame(updateProgress);
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
})

function updateProgress() {
    const duration = audioPlayer.duration || 0;
    if (duration > 0) {
        const tragetTime = audioPlayer.currentTime;
        smoothTime += (tragetTime - smoothTime) * 0.01;
        const progressPercent = (smoothTime / duration) * 100;
        progressBar.style.width = progressPercent + `%`;
    }
    if (!audioPlayer.paused && !audioPlayer.ended) {
        requestAnimationFrame(updateProgress);
    }
}

audioPlayer.addEventListener('ended', () => {
    smoothTime = 0;
    progressBar.style.width = "0%";
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
});


audioPlayer.addEventListener('timeupdate', () => {
    const current = audioPlayer.currentTime;
    currentTime.textContent = formatTime(current);
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}




