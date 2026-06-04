// ===============================
// JAMENDO CONFIG
// ===============================

const CLIENT_ID = "46ba6273";

const PLAYLISTS = {
  fresh: "500608490",
  indie: "500608900",
  chill: "500605176",
};

// ===============================
// GLOBAL SONG STORAGE
// ===============================

window.allSongs = [];

// ===============================
// API REQUEST
// ===============================

async function getPlaylistTracks(playlistId) {
  try {
    const url = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${CLIENT_ID}&id=${playlistId}&format=json&limit=100`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch playlist");
    }

    const data = await response.json();

    return data.results[0]?.tracks || [];
  } catch (error) {
    console.error(error);

    return [];
  }
}

// ===============================
// CREATE SONG CARD
// ===============================

function createSongCard(song) {
  const card = document.createElement("div");

  card.className =
    "song-card bg-[#1d1d1d] p-3 rounded-lg cursor-pointer hover:bg-[#282828] transition";

  card.innerHTML = `

        <div class="relative">

            <img
                src="${song.album_image}"
                alt="${song.name}"
                class="w-full rounded-md object-cover aspect-square"
            >

            <button
                class="play-card-btn absolute bottom-2 right-2 bg-green-500 text-black w-10 h-10 rounded-full"
                data-id="${song.id}"
            >
                <i class="fa-solid fa-play"></i>
            </button>

        </div>

        <h3 class="mt-3 font-semibold line-clamp-1">
            ${song.name}
        </h3>

        <p class="text-gray-400 text-sm line-clamp-1">
            ${song.artist_name}
        </p>

    `;

  card.addEventListener("click", () => {
    const index = window.allSongs.findIndex((s) => s.id === song.id);

    if (index !== -1) {
      loadSong(index);
      playSong();
    }
  });

  return card;
}

// ===============================
// RENDER SECTION
// ===============================

function renderSongs(containerId, songs) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = "";

  songs.forEach((song) => {
    container.appendChild(createSongCard(song));
  });
}

// ===============================
// LOAD FRESH
// ===============================

async function loadFreshSongs() {
  const songs = await getPlaylistTracks(PLAYLISTS.fresh);

  window.allSongs.push(...songs);

  renderSongs("freshSongs", songs);
}

// ===============================
// LOAD INDIE
// ===============================

async function loadIndieSongs() {
  const songs = await getPlaylistTracks(PLAYLISTS.indie);

  window.allSongs.push(...songs);

  renderSongs("indieSongs", songs);
}

// ===============================
// LOAD CHILL
// ===============================

async function loadChillSongs() {
  const songs = await getPlaylistTracks(PLAYLISTS.chill);

  window.allSongs.push(...songs);

  renderSongs("chillSongs", songs);
}

// ===============================
// TRENDING TRACKS
// ===============================

async function loadTrendingSongs() {
  try {
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&order=popularity_total`;

    const response = await fetch(url);

    const data = await response.json();

    const songs = data.results;

    window.allSongs.push(...songs);

    renderSongs("trendingSongs", songs);
  } catch (error) {
    console.error(error);
  }
}

// ===============================
// SEARCH
// ===============================

function searchSongs(query) {
  const results = window.allSongs.filter(
    (song) =>
      song.name.toLowerCase().includes(query.toLowerCase()) ||
      song.artist_name.toLowerCase().includes(query.toLowerCase()),
  );

  const section = document.getElementById("searchSection");

  section.classList.remove("hidden");

  renderSongs("searchResults", results);
}

// ===============================
// SEARCH EVENTS
// ===============================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();

  if (!value) {
    document.getElementById("searchSection").classList.add("hidden");

    return;
  }

  searchSongs(value);
});

// ===============================
// INITIAL LOAD
// ===============================

async function initializeAPI() {
  await loadFreshSongs();

  await loadTrendingSongs();

  await loadIndieSongs();

  await loadChillSongs();
}

initializeAPI();
