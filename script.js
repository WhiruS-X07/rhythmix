/* =========================================
   🎵 DOM Elements
========================================= */
const player = document.querySelector('.player');
const playerMob = document.querySelector('.player-mobile');

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
const mobileNav = document.querySelector('.mobile-nav');
const menuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

const audioPlayer = document.getElementById('audioPlayer');
const queue = document.querySelector('.queue');
const queueList = document.getElementById('queueList');
const nav = document.querySelector('.nav');

/* =========================================
   🎵 Global State
========================================= */
let _queueSongList = [];
let currentIndex = 0;
let smoothTime = 0;
let repeat = false;
let catalogTracks = []; // tracks from API for random fallback
let clientId = null;

let queueSongList = new Proxy(_queueSongList, {
    set(target, property, value) {
        target[property] = value;
        renderQueue();       // keep UI in sync
        updateQueueButtonsVisibility();
        return true;
    }
});

/* =========================================
   🎵 Utilities
========================================= */
function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

function truncateText(text, maxLength = 13) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================================
   🎵 Queue UI
========================================= */
function renderQueue() {
    if (!queueList) return;
    queueList.innerHTML = '';

    queueSongList.forEach((song, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
        <button class="queuePlay cursor-pointer"><i class="fa-solid fa-play"></i></button>
        <pre><strong>${song.title}</strong> <span class="text-sm font-thin">By ${song.artist}</span></pre>`;
        li.className = 'flex bg-white backdrop-blur bg-opacity-50 text-black text-opacity-50 hover:text-[#ebeae8] my-2 px-3 py-3 rounded gap-2 overflow-x-auto scrollbar-hide';
        if (idx === currentIndex) {
            li.classList.add('bg-white', 'bg-opacity-10');
        }

        const queuePlayPauseBtn= li.querySelector('.queuePlay');
        queuePlayPauseBtn.addEventListener('click', () => {
            // manual play from queue item
            playSong(song.file, song.title, song.artist, true);
        });

        queueList.appendChild(li);
    });
}

function updateQueueButtonsVisibility() {
    const addQueueBtns = document.querySelectorAll(".add-queue-btn");
    if (!addQueueBtns.length) return;
    addQueueBtns.forEach(btn => {
        // When queue has songs, show "add to queue" buttons too (your earlier logic hid when empty).
        // It's more useful to keep them visible always, but honoring your original check:
        if (queueSongList.length === 0) {
            btn.classList.add("hidden");
        } else {
            btn.classList.remove("hidden");
        }
    });
}

/* =========================================
   🎵 Player Core
========================================= */
function noAudio() {
    if (!audioPlayer.src) {
        [playPauseBtn, playPauseBtnMobile].forEach(btn => btn.disabled = true);
        [playPauseBtn, playPauseBtnMobile].forEach(btn => btn.innerHTML = '<i class="fa-solid fa-play"></i>');
        [progressBar, progressBarMobile].forEach(bar => bar.style.width = "0%");
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    } else {
        [playPauseBtn, playPauseBtnMobile].forEach(btn => btn.disabled = false);
    }
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        [playPauseBtn, playPauseBtnMobile].forEach(btn => btn.innerHTML = '<i class="fa-solid fa-pause"></i>');
        noAudio();
        requestAnimationFrame(updateProgress);
    } else {
        audioPlayer.pause();
        [playPauseBtn, playPauseBtnMobile].forEach(btn => btn.innerHTML = '<i class="fa-solid fa-play"></i>');
    }
}

function toggleRepeat() {
    repeat = !repeat;
    audioPlayer.loop = repeat; // ✅ native looping
    [repeatBtn, repeatBtnMobile].forEach(btn => {
        btn.classList.toggle('active', repeat);
        btn.innerHTML = repeat ? '<i class="fa-solid fa-rotate-right fa-spin"></i>' : '<i class="fa-solid fa-rotate-right"></i>';
    });
}


function setSongLabels(titleName, artistName) {
    [title, titleMobile].forEach(el => el.textContent = truncateText(titleName));
    [artist, artistMobile].forEach(el => el.textContent = artistName || '');
}

function showCorrectPlayer() {
    if (window.innerWidth < 1000) {
        playerMob.classList.remove('hidden');
        player.classList.add('hidden');
        playPauseBtnMobile.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        player.classList.remove('hidden');
        playerMob.classList.add('hidden');
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
}

function playSong(filePath, titleName, artistName, fromManual = false) {
    // ensure song is in queue + sync index on manual plays
    let idx = queueSongList.findIndex(s => s.file === filePath);
    if (idx === -1) {
        queueSongList.push({ file: filePath, title: titleName, artist: artistName });
        idx = queueSongList.length - 1;
    }
    if (fromManual) {
        currentIndex = idx;
        renderQueue();
    }

    audioPlayer.src = filePath;
    audioPlayer.play();

    // ✅ do NOT change repeat state or its UI here
    [progressBar, progressBarMobile].forEach(bar => bar.style.width = '0%');
    currentTime.textContent = currentTimeMobile.textContent = '0:00';
    duration.textContent = durationMobile.textContent = '0:00';

    setSongLabels(titleName, artistName);
    showCorrectPlayer();

    audioPlayer.onloadedmetadata = () => {
        const durationTime = audioPlayer.duration;
        duration.textContent = durationMobile.textContent = formatTime(durationTime);
    };

    smoothTime = 0;
    requestAnimationFrame(updateProgress);
}


function stopAudio() {
    audioPlayer.pause();
    player.classList.add('hidden');
    smoothTime = 0;
    audioPlayer.currentTime = 0;
    progressBar.style.width = '0%';
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

function nextInQueueOrRandom() {
    if (queueSongList.length > 0) {
        currentIndex++;
        if (currentIndex >= queueSongList.length) {
            // if index runs past, fallback to random from catalog
            if (catalogTracks.length > 0) {
                const t = randomItem(catalogTracks);
                playSong(t.audio, t.name, t.artist_name, true);
                return;
            }
            // else wrap
            currentIndex = 0;
        }
        const nextSong = queueSongList[currentIndex];
        playSong(nextSong.file, nextSong.title, nextSong.artist);
    } else {
        // queue empty → play random from API catalog
        if (catalogTracks.length > 0) {
            const t = randomItem(catalogTracks);
            playSong(t.audio, t.name, t.artist_name, true);
        } else {
            // nothing to play
            [playPauseBtn, playPauseBtnMobile].forEach(btn => btn.innerHTML = '<i class="fa-solid fa-play"></i>');
        }
    }
}

function prevInQueueOrRestart() {
    if (queueSongList.length > 0) {
        if (audioPlayer.currentTime > 3) {
            // restart current song if a bit progressed
            audioPlayer.currentTime = 0;
            return;
        }
        currentIndex--;
        if (currentIndex < 0) currentIndex = 0;
        const prevSong = queueSongList[currentIndex];
        playSong(prevSong.file, prevSong.title, prevSong.artist);
    } else {
        // No queue: restart current if any
        audioPlayer.currentTime = 0;
    }
}

/* =========================================
   🎵 Progress / Time
========================================= */
function updateProgress() {
    const dur = audioPlayer.duration || 0;
    if (dur > 0) {
        smoothTime += (audioPlayer.currentTime - smoothTime) * 0.1;
        const progressPercent = (smoothTime / dur) * 100;
        [progressBar, progressBarMobile].forEach(bar => bar.style.width = progressPercent + '%');
    }
    if (!audioPlayer.paused && !audioPlayer.ended) {
        requestAnimationFrame(updateProgress);
    }
}

audioPlayer.addEventListener('timeupdate', () => {
    const current = audioPlayer.currentTime;
    currentTime.textContent = formatTime(current);
    currentTimeMobile.textContent = formatTime(current);
});

audioPlayer.addEventListener("ended", () => {
    smoothTime = 0;
    [progressBar, progressBarMobile].forEach(bar => bar.style.width = '0%');
    [playPauseBtn, playPauseBtnMobile].forEach(btn => btn.innerHTML = '<i class="fa-solid fa-play"></i>');

    if (repeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        [playPauseBtn, playPauseBtnMobile].forEach(btn => btn.innerHTML = '<i class="fa-solid fa-pause"></i>');
        requestAnimationFrame(updateProgress);
    } else {
        nextInQueueOrRandom();
    }
});

function seekAudioFromEvent(e, barEl) {
    const parent = barEl.parentElement;
    const rect = parent.getBoundingClientRect();
    const clientX = (e.touches && e.touches.length) ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const percent = offsetX / rect.width;
    if (Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
        audioPlayer.currentTime = percent * audioPlayer.duration;
        [progressBar, progressBarMobile].forEach(bar => bar.style.width = (percent * 100) + '%');
    }
}

/* =========================================
   🎵 Queue Actions
========================================= */
function saveCurrentSong(filePath, titleName, artistName) {
    const currentSong = { file: filePath, title: titleName, artist: artistName };
    if (!queueSongList.some(song => song.file === currentSong.file)) {
        queueSongList.push(currentSong);
    }
}

function playFromButton(btnOrMock) {
    const file = btnOrMock.dataset.file;
    const titleN = btnOrMock.dataset.title;
    const artistN = btnOrMock.dataset.artist;
    saveCurrentSong(file, titleN, artistN);
    playSong(file, titleN, artistN, true);
}

function addQueue(btn) {
    saveCurrentSong(btn.dataset.file, btn.dataset.title, btn.dataset.artist);
}

/* =========================================
   🎵 UI / Layout Controls
========================================= */
function resizeBy() {
    if (window.innerWidth < 1000) {
        playerMob.classList.remove('hidden');
        player.classList.add('hidden');
        nav?.classList.add('hidden');
        mobileNav?.classList.remove('hidden');
    } else {
        playerMob.classList.add('hidden');
        nav?.classList.remove('hidden');
        mobileNav?.classList.add('hidden');
        if (!audioPlayer.paused && audioPlayer.src) {
            player.classList.remove('hidden');
        }
    }
}

function toggleQueue() {
    queue.classList.toggle('hidden');
}

/* =========================================
   🎵 Drag & Scroll Helpers
========================================= */
function dragEln(el) {
    let startX, startY, initialLeft, initialTop;

    el.onmousedown = dragMouseDown;
    el.ontouchstart = touchStart;

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

    function touchStart(e) {
        e.preventDefault();
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialLeft = el.offsetLeft;
        initialTop = el.offsetTop;
        el.ontouchmove = touchMove;
        el.ontouchend = touchStop;
    }

    function touchMove(e) {
        let dx = e.touches[0].clientX - startX;
        let dy = e.touches[0].clientY - startY;
        let newLeft = Math.min(Math.max(initialLeft + dx, 0), window.innerWidth - el.offsetWidth);
        let newTop = Math.min(Math.max(initialTop + dy, 0), window.innerHeight - el.offsetHeight);
        el.style.left = newLeft + 'px';
        el.style.top = newTop + 'px';
    }

    function touchStop() {
        el.ontouchmove = null;
        el.ontouchend = null;
    }
}

function scrollbarHide(el) {
    let isDown = false;
    let startX, startY, scrollLeft, moved = false;

    el.addEventListener('pointerdown', (e) => {
        isDown = true;
        el.style.cursor = 'grabbing';
        startX = e.pageX;
        scrollLeft = el.scrollLeft;
        e.preventDefault();
    });

    el.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        el.scrollLeft = scrollLeft - (e.pageX - startX) * 2;
    });

    el.addEventListener('pointerup', () => {
        isDown = false;
        el.style.cursor = 'grab';
    });
    el.addEventListener('pointerleave', () => {
        isDown = false;
        el.style.cursor = 'grab';
    });

    el.addEventListener('touchstart', (e) => {
        isDown = true;
        moved = false;
        el.classList.add('scrolling');
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
        scrollLeft = el.scrollLeft;
        e.preventDefault();
    }, { passive: false });

    el.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const dx = e.touches[0].pageX - startX;
        const dy = e.touches[0].pageY - startY;

        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            moved = true;
            el.scrollLeft = scrollLeft - dx * 2;
        }
    }, { passive: false });

    el.addEventListener('touchend', () => {
        isDown = false;
        el.classList.remove('scrolling');
    });

    el.addEventListener('touchcancel', () => {
        isDown = false;
        el.classList.remove('scrolling');
    });
}

/* =========================================
   🎵 Progress Bar Events (click/touch)
========================================= */
function attachProgressSeekers() {
    const desktopTrack = progressBar?.parentElement;
    const mobileTrack = progressBarMobile?.parentElement;

    if (desktopTrack) {
        desktopTrack.addEventListener('click', (e) => seekAudioFromEvent(e, progressBar));
        desktopTrack.addEventListener('touchstart', (e) => seekAudioFromEvent(e, progressBar), { passive: true });
    }
    if (mobileTrack) {
        mobileTrack.addEventListener('click', (e) => seekAudioFromEvent(e, progressBarMobile));
        mobileTrack.addEventListener('touchstart', (e) => seekAudioFromEvent(e, progressBarMobile), { passive: true });
    }
}

/* =========================================
   🎵 API: Client + Playlists + Cards
========================================= */
async function getClientId() {
    const res = await fetch("assets/api.php");
    const data = await res.json();
    return data.CLIENT_ID;
}

async function fetchPlaylist(playlistId, container) {
    try {
        const url = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${clientId}&id=${playlistId}&format=json&limit=100`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch playlist");

        const data = await response.json();
        if (!data.results.length) return;
        const playlist = data.results[0];
        if (!playlist.tracks?.length) return;

        // merge tracks into catalog for random fallback
        catalogTracks.push(...playlist.tracks);

        container.innerHTML = "";

        playlist.tracks.slice(0, 20).forEach(track => {
            const div = document.createElement("div");
            div.className = "card flex flex-col";
            div.setAttribute("data-aos", "fade-left");
            div.setAttribute("data-aos-easing", "ease-in-sine");
            div.setAttribute("data-aos-delay", "300");

            if (/Mobi|Android/i.test(navigator.userAgent)) {
                // Mobile: whole card is tappable with threshold
                div.innerHTML = `
          <img class="cover-img" src="${track.album_image}" width="80">
          <h3>${track.name}</h3>
          <p>${track.artist_name}</p>
        `;

                let moved = false, startX, startY;

                div.addEventListener('touchstart', (e) => {
                    moved = false;
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                });

                div.addEventListener('touchmove', (e) => {
                    const dx = Math.abs(e.touches[0].pageX - startX);
                    const dy = Math.abs(e.touches[0].pageY - startY);
                    if (dx > 10 || dy > 10) moved = true;
                });

                div.addEventListener('touchend', () => {
                    if (!moved) {
                        playFromButton({
                            dataset: {
                                file: track.audio,
                                title: track.name,
                                artist: track.artist_name
                            }
                        });
                    }
                });

                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    playFromButton({
                        dataset: {
                            file: track.audio,
                            title: track.name,
                            artist: track.artist_name
                        }
                    });
                });

            } else {
                // Desktop: explicit play & add buttons
                div.innerHTML = `
          <img class="cover-img" src="${track.album_image}" width="80" alt="${track.name}">
          <h3>${track.name}</h3>
          <p>${track.artist_name}</p>
          <button class="play-button" aria-label="Play ${track.name}" 
                  data-file="${track.audio}" 
                  data-title="${track.name}" 
                  data-artist="${track.artist_name}">
            <i class="fa-solid fa-play"></i>
          </button>
          <button class="add-queue-btn" aria-label="Add ${track.name} to queue"
                  data-file="${track.audio}" 
                  data-title="${track.name}" 
                  data-artist="${track.artist_name}">
            <i class="fa-solid fa-plus"></i>
          </button>
        `;

                // Hook up button events
                const playBtn = div.querySelector('.play-button');
                const addBtn = div.querySelector('.add-queue-btn');

                playBtn.addEventListener('click', function () {
                    playFromButton(this);
                });

                addBtn.addEventListener('click', function () {
                    addQueue(this);
                });
            }

            container.appendChild(div);
        });

        const last = document.createElement("div");
        last.className = "view-all flex items-center justify-center w-auto";
        last.innerHTML = `
      <a data-id="${playlistId}" class="flex gap-2 items-center justify-center">
        <h2>View All</h2><i class="fa-solid fa-arrow-right"></i>
      </a>
    `;
        container.appendChild(last);

        return data;
    } catch (err) {
        console.error("Error fetching playlist:", err);
    }
}

/* =========================================
   🎵 Boot: fetch, bind, init
========================================= */
(async () => {
    // Init UI basics
    resizeBy();
    window.addEventListener('resize', resizeBy);
    noAudio();

    // Bind player controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    playPauseBtnMobile.addEventListener('click', togglePlayPause);

    repeatBtn.addEventListener('click', toggleRepeat);
    repeatBtnMobile.addEventListener('click', toggleRepeat);

    queueBtn.addEventListener('click', toggleQueue);
    queueBtnMobile.addEventListener('click', toggleQueue);

    closeBtn.addEventListener('click', stopAudio);

    nextBtn.addEventListener('click', nextInQueueOrRandom);
    nextBtnMobile.addEventListener('click', nextInQueueOrRandom);

    prevBtn.addEventListener('click', prevInQueueOrRestart);
    prevBtnMobile.addEventListener('click', prevInQueueOrRestart);

    attachProgressSeekers();

    // Drag player and enable horizontal drag scroll containers
    dragEln(player);
    document.querySelectorAll('.sideScroll').forEach(el => scrollbarHide(el));

    // API boot
    clientId = await getClientId();

    // await Promise.all([
        fetchPlaylist("500608490", document.getElementById("p-1")),
        fetchPlaylist("500608900", document.getElementById("p-2")),
        fetchPlaylist("500605176", document.getElementById("p-3"))
    // ]);

    // After playlists load
    updateQueueButtonsVisibility();
    if (typeof AOS !== 'undefined' && AOS.refresh) AOS.refresh();
})();
