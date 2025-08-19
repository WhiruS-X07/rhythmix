async function getClientId() {
  const res = await fetch("assets/api.php");
  const data = await res.json();
  return data.CLIENT_ID;
}

(async () => {
  const clientId = await getClientId();

  async function fetchPlaylist(playlistId, container) {
    try {
      const url = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${clientId}&id=${playlistId}&format=json`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch playlist");

      const data = await response.json();
      const playlist = data.results[0]; // Jamendo puts playlists in results[]
      const tracks = playlist.tracks;

      container.innerHTML = "";
      tracks.forEach(track => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <img src="${track.album_image}" width="80">
          <h3>${track.name}</h3>
          <p>${track.artist_name}</p>
          <button data-file="${track.audio}" data-title=${track.name} data-artist=${track.artist_name} onclick="playFromButton(this)"><i class="fa-solid fa-play"></i></button>
        `;
        container.appendChild(div);
      });

      console.log(data);
    } catch (err) {
      console.error("Error fetching playlist:", err);
    }
  }

  fetchPlaylist("500386475", document.getElementById("songs"));
})();


