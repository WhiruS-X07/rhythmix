// ==========================
// ✅ DOM ELEMENTS
// ==========================

// Desktop Player Elements
const player = document.querySelector('.player');
const playPauseBtn = document.getElementById('playBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBar = document.getElementById('progress');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const queueBtn = document.getElementById('queuebtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const closeBtn = document.getElementById('closeBtn');

// Mobile Player Elements
const playerMob = document.querySelector('.player-mobile');
const playPauseBtnMobile = document.getElementById('playBtn-mobile');
const repeatBtnMobile = document.getElementById('repeatBtn-mobile');
const progressBarMobile = document.getElementById('progress-mobile');
const currentTimeMobile = document.getElementById('current-time-mobile');
const durationMobile = document.getElementById('duration-mobile');
const titleMobile = document.getElementById('title-mobile');
const artistMobile = document.getElementById('artist-mobile');
const queueBtnMobile = document.getElementById('queuebtn-mobile');
const prevBtnMobile = document.getElementById('prevBtn-mobile');
const nextBtnMobile = document.getElementById('nextBtn-mobile');

// Other Elements
const audioPlayer = document.getElementById('audioPlayer');
const queue = document.querySelector('.queue');
const queueList = document.getElementById('queueList');
const nav = document.querySelector('.nav');
const mobileNav = document.querySelector('.mobile-nav');
const menuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');


// ==========================
// ✅ GLOBAL VARIABLES
// ==========================
let playedSong = [];
let smoothTime = 0;
let repeat = false;


// ==========================
// ✅ HELPER FUNCTIONS
// ==========================

// Format time in mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

// Truncate long song titles
function truncateText(text, maxLength = 13) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}



// ==========================
// ✅ RESPONSIVE PLAYER TOGGLE
// ==========================
function resizeBy() {
    if (window.innerWidth < 1000) {
        playerMob.classList.remove('hidden');
        player.classList.add('hidden');
        nav.classList.add('hidden');
        mobileNav.classList.remove('hidden');
    } else {
        playerMob.classList.add('hidden');
        nav.classList.remove('hidden');
        mobileNav.classList.add('hidden');
    }
}
window.addEventListener('resize', resizeBy);
resizeBy();

// ==========================
// ✅ AUDIO CONTROL FUNCTIONS
// ==========================

// Disable play if no audio loaded
noAudio();
function noAudio() {
    if (!audioPlayer.src) {
        [playPauseBtn, playPauseBtnMobile].forEach(btn => btn.disabled = true);
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playPauseBtnMobile.innerHTML = '<i class="fa-solid fa-play"></i>';
        [progressBar, progressBarMobile].forEach(bar => bar.style.width = "0%");
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    } else {
        playPauseBtn.disabled = false;
        playPauseBtnMobile.disabled = false;
    }
}

// Play/Pause Toggle
function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        playPauseBtnMobile.innerHTML = '<i class="fa-solid fa-pause"></i>';
        noAudio();
        requestAnimationFrame(updateProgress);
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playPauseBtnMobile.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}

// Repeat Toggle
function toggleRepeat() {
    repeat = !repeat;
    [repeatBtn, repeatBtnMobile].forEach(btn => {
        btn.classList.toggle('active', repeat);
        btn.innerHTML = repeat ? '<i class="fa-solid fa-rotate-right fa-spin"></i>' : '<i class="fa-solid fa-rotate-right"></i>';
    });
}

// Update progress bar
function updateProgress() {
    const duration = audioPlayer.duration || 0;
    if (duration > 0) {
        const targetTime = audioPlayer.currentTime;
        smoothTime += (targetTime - smoothTime) * 0.1;
        const progressPercent = (smoothTime / duration) * 100;
        progressBar.style.width = progressPercent + '%';
        progressBarMobile.style.width = progressPercent + '%';
    }
    if (!audioPlayer.paused && !audioPlayer.ended) {
        requestAnimationFrame(updateProgress);
    }
    if (audioPlayer.ended) {
        smoothTime = 0;
        progressBar.style.width = '0%';
        progressBarMobile.style.width = '0%';
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playPauseBtnMobile.innerHTML = '<i class="fa-solid fa-play"></i>';

        if (repeat) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            playPauseBtnMobile.innerHTML = '<i class="fa-solid fa-pause"></i>';
            requestAnimationFrame(updateProgress);
        }
    }
}

// Update current time display
audioPlayer.addEventListener('timeupdate', () => {
    const current = audioPlayer.currentTime;
    currentTime.textContent = formatTime(current);
    currentTimeMobile.textContent = formatTime(current);
});

// Stop audio playback
function stopAudio() {
    audioPlayer.pause();
    player.classList.add('hidden');
    smoothTime = 0;
    audioPlayer.currentTime = 0;
    progressBar.style.width = '0%';
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

// ==========================
// ✅ SONG MANAGEMENT
// ==========================

// Save current song in queue
function saveCurrentSong(filePath, titleName, artistName) {
    const currentSong = { file: filePath, title: titleName, artist: artistName };
    if (!playedSong.some(song => song.file === currentSong.file)) playedSong.push(currentSong);

    queueList.innerHTML = '';
    playedSong.forEach(song => {
        const listItem = document.createElement('li');
        listItem.textContent = `${song.title} - ${song.artist}`;
        listItem.classList.add('text-black', 'text-opacity-70', 'hover:text-white', 'cursor-pointer');
        queueList.appendChild(listItem);
    });
}

// Play song from button click
function playFromButton(btn) {
    playsong(btn.dataset.file, btn.dataset.title, btn.dataset.artist);
    saveCurrentSong(btn.dataset.file, btn.dataset.title, btn.dataset.artist);
}

// Play song function
function playsong(filePath, titleName, artistName) {
    audioPlayer.src = filePath;
    audioPlayer.play();
    player.classList.remove('hidden');

    [progressBar, progressBarMobile].forEach(bar => bar.style.width = '0%');
    currentTime.textContent = currentTimeMobile.textContent = '0:00';
    duration.textContent = durationMobile.textContent = '0:00';

    [title, titleMobile].forEach(el => el.textContent = truncateText(titleName));
    [artist, artistMobile].forEach(el => el.textContent = artistName);

    if (window.innerWidth < 1000) {
        playerMob.classList.remove('hidden');
        player.classList.add('hidden');
        playPauseBtnMobile.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        player.classList.remove('hidden');
        playerMob.classList.add('hidden');
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }

    audioPlayer.addEventListener('loadedmetadata', () => {
        const durationTime = audioPlayer.duration;
        duration.textContent = durationMobile.textContent = formatTime(durationTime);
    });

    smoothTime = 0;
    requestAnimationFrame(updateProgress);
}


// ==========================
// ✅ QUEUE & MENU TOGGLE
// ==========================
function toggleQueue() {
    queue.classList.toggle('hidden');
}

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});


// ==========================
// ✅ DRAGGABLE DESKTOP PLAYER
// ==========================
dragEln(player);
function dragEln(el) {
    let startX, startY, initialLeft, initialTop;

    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = el.offsetLeft;
        initialTop = el.offsetTop;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        let newLeft = Math.min(Math.max(initialLeft + dx, 0), window.innerWidth - el.offsetWidth);
        let newTop = Math.min(Math.max(initialTop + dy, 0), window.innerHeight - el.offsetHeight);

        el.style.left = newLeft + 'px';
        el.style.top = newTop + 'px';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sideScroll = document.querySelectorAll('.sideScroll');
    sideScroll.forEach(el => {
        scrollbarHide(el);
    })
});
function scrollbarHide(el) {
    let startX, initialLeft;

    el.onmousedown = scrollMouseDown;
    el.ontouchstart = touchStart;

    function scrollMouseDown(e) {
        e.preventDefault();
        el.classList.add('scrolling');
        startX = e.clientX;
        initialLeft = el.scrollLeft;
        document.onmouseup = closeScrollElement;
        document.onmousemove = elementScroll;
    }

    function elementScroll(e) {
        e.preventDefault();
        const dx = e.clientX - startX;
        el.scrollLeft = initialLeft - dx;
    }

    function closeScrollElement() {
        el.classList.remove('scrolling');
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function touchStart(e) {
        e.preventDefault();
        el.classList.add('scrolling');
        startX = e.touches[0].clientX;
        initialLeft = el.scrollLeft;
        el.ontouchmove = touchMove;
        el.ontouchend = touchStop;
    }

    function touchMove(e) {
        const dx = e.touches[0].clientX - startX;
        el.scrollLeft = initialLeft - dx;
    }

    function touchStop() {
        el.classList.remove('scrolling');
        el.ontouchmove = null;
        el.ontouchend = null;
    }
}




// ==========================
// ✅ EVENT LISTENERS
// ==========================
playPauseBtn.addEventListener('click', togglePlayPause);
playPauseBtnMobile.addEventListener('click', togglePlayPause);

repeatBtn.addEventListener('click', toggleRepeat);
repeatBtnMobile.addEventListener('click', toggleRepeat);

queueBtn.addEventListener('click', toggleQueue);
queueBtnMobile.addEventListener('click', toggleQueue);

closeBtn.addEventListener('click', stopAudio);

