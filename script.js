// ======================================
// DOM ELEMENTS
// ======================================

const audio = document.getElementById("audioPlayer");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volumeSlider = document.getElementById("volumeSlider");
const muteBtn = document.getElementById("muteBtn");

const coverImage = document.getElementById("coverImage");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");

const favoriteBtn = document.getElementById("favoriteBtn");

const queueBtn = document.getElementById("queueBtn");
const queuePanel = document.getElementById("queuePanel");
const closeQueue = document.getElementById("closeQueue");
const queueList = document.getElementById("queueList");

// ======================================
// STATE
// ======================================

let currentSongIndex = -1;

let isPlaying = false;
let isShuffle = false;
let repeatMode = false;

let queue = [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let recentlyPlayed = JSON.parse(localStorage.getItem("recentSongs")) || [];

// ======================================
// SONG LOADER
// ======================================

function loadSong(index) {
  if (!window.allSongs[index]) return;

  currentSongIndex = index;

  const song = window.allSongs[index];

  audio.src = song.audio;

  coverImage.src = song.album_image || "https://via.placeholder.com/150";

  songTitle.textContent = song.name;

  artistName.textContent = song.artist_name;

  updateFavoriteButton();

  saveRecentlyPlayed(song);
}

// ======================================
// PLAY
// ======================================

function playSong() {
  audio.play();

  isPlaying = true;

  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

// ======================================
// PAUSE
// ======================================

function pauseSong() {
  audio.pause();

  isPlaying = false;

  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

// ======================================
// PLAY BUTTON
// ======================================

playBtn.addEventListener("click", () => {
  if (currentSongIndex === -1) {
    loadSong(0);

    playSong();

    return;
  }

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// ======================================
// NEXT SONG
// ======================================

function nextSong() {
  if (!window.allSongs.length) return;

  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * window.allSongs.length);
  } else {
    currentSongIndex++;

    if (currentSongIndex >= window.allSongs.length) {
      currentSongIndex = 0;
    }
  }

  loadSong(currentSongIndex);

  playSong();
}

// ======================================
// PREVIOUS SONG
// ======================================

function previousSong() {
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = window.allSongs.length - 1;
  }

  loadSong(currentSongIndex);

  playSong();
}

// ======================================
// BUTTON EVENTS
// ======================================

nextBtn.addEventListener("click", nextSong);

prevBtn.addEventListener("click", previousSong);

// ======================================
// SHUFFLE
// ======================================

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;

  shuffleBtn.classList.toggle("text-green-500");
});

// ======================================
// REPEAT
// ======================================

repeatBtn.addEventListener("click", () => {
  repeatMode = !repeatMode;

  repeatBtn.classList.toggle("text-green-500");
});

// ======================================
// AUTO NEXT
// ======================================

audio.addEventListener("ended", () => {
  if (repeatMode) {
    audio.currentTime = 0;

    playSong();

    return;
  }

  nextSong();
});

// ======================================
// PROGRESS BAR
// ======================================

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const progress = (audio.currentTime / audio.duration) * 100;

  progressBar.value = progress;

  currentTime.textContent = formatTime(audio.currentTime);

  duration.textContent = formatTime(audio.duration);
});

// ======================================
// SEEK
// ======================================

progressBar.addEventListener("input", () => {
  if (!audio.duration) return;

  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// ======================================
// TIME FORMAT
// ======================================

function formatTime(time) {
  const mins = Math.floor(time / 60);

  const secs = Math.floor(time % 60);

  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// ======================================
// VOLUME
// ======================================

audio.volume = 0.8;

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value / 100;
});

// ======================================
// MUTE
// ======================================

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;

  muteBtn.innerHTML = audio.muted
    ? '<i class="fa-solid fa-volume-xmark"></i>'
    : '<i class="fa-solid fa-volume-high"></i>';
});

// ======================================
// FAVORITES
// ======================================

favoriteBtn.addEventListener("click", toggleFavorite);

function toggleFavorite() {
  if (currentSongIndex === -1) return;

  const song = window.allSongs[currentSongIndex];

  const exists = favorites.find((item) => item.id === song.id);

  if (exists) {
    favorites = favorites.filter((item) => item.id !== song.id);
  } else {
    favorites.push(song);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  updateFavoriteButton();
}

function updateFavoriteButton() {
  if (currentSongIndex === -1) return;

  const song = window.allSongs[currentSongIndex];

  const exists = favorites.find((item) => item.id === song.id);

  favoriteBtn.innerHTML = exists
    ? '<i class="fa-solid fa-heart text-red-500"></i>'
    : '<i class="fa-regular fa-heart"></i>';
}

// ======================================
// RECENTLY PLAYED
// ======================================

function saveRecentlyPlayed(song) {
  recentlyPlayed = recentlyPlayed.filter((item) => item.id !== song.id);

  recentlyPlayed.unshift(song);

  recentlyPlayed = recentlyPlayed.slice(0, 20);

  localStorage.setItem("recentSongs", JSON.stringify(recentlyPlayed));
}

// ======================================
// QUEUE
// ======================================

function addToQueue(song) {
  queue.push(song);

  renderQueue();
}

function renderQueue() {
  queueList.innerHTML = "";

  queue.forEach((song, index) => {
    const div = document.createElement("div");

    div.className =
      "flex justify-between items-center p-2 border-b border-gray-700";

    div.innerHTML = `
                <span>${song.name}</span>

                <button data-index="${index}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

    queueList.appendChild(div);
  });
}

// ======================================
// QUEUE PANEL
// ======================================

queueBtn.addEventListener("click", () => {
  queuePanel.classList.remove("translate-x-full");
});

closeQueue.addEventListener("click", () => {
  queuePanel.classList.add("translate-x-full");
});

// ======================================
// KEYBOARD SHORTCUTS
// ======================================

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    playBtn.click();
  }

  if (e.code === "ArrowRight") {
    nextSong();
  }

  if (e.code === "ArrowLeft") {
    previousSong();
  }
});
