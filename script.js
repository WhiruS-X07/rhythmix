function playSong(filePath, title) {
    console.log("Trying to play:", filePath);
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const audioSource = document.getElementById('audioSource');
    const currentTitle = document.getElementById('currentSongTitle');

    if (audioSource.getAttribute('src') !== filePath) {
        audioSource.setAttribute('src', filePath);
        audioPlayer.load();
    }

    audioPlayer.play().catch(error => {
        console.error("Playback error:", error);
    });

    currentTitle.textContent = title;
}




