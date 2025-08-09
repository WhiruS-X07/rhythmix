<?php
include("header.php");
include("config.php");

session_start();

$sql = "SELECT * FROM music";
$result = $conn->query($sql);


$isLoggedIn = isset($_SESSION['user_id']); // true if logged in
if ($isLoggedIn) {
    $userId = (int) $_SESSION['user_id'];
    $sql_user = "SELECT * FROM users WHERE id = " . $_SESSION['user_id'];
    $result_user = $conn->query($sql_user);
}

?>

<body class=" bg-[#f6f5f7] text-black">

    <!-- ✅ Fixed Top Navbar -->
    <div
        class="fixed top-0 left-0 right-0 flex items-center justify-between bg-[#f6f5f7] bg-opacity-30 backfrop-blur-md px-4 py-2  shadow-xl z-50">

        <!-- Home + Search -->
        <div class="home flex items-center gap-4 shrink min-w-0">
            <a href="#" class="flex items-center gap-2 font-bold text-xl hover:text-blue-400 transition text-black">
                <i class="fa-solid fa-house"></i>
                Home
            </a>
            <div class="relative flex items-center justify-center ">
                <input type="text" id="searchfield" placeholder="Search..." class="searchfield   shadow-xl" />
                <div class="search"></div>
            </div>
        </div>


        <!-- Logo Section -->
        <div class="logo flex items-center gap-3 shrink-0">
            <img src="assets/logo.png" alt="logo" class="w-16 h-16">
            <h1 class="font-bold text-2xl text-black    ">Rhythmix</h1>
        </div>



        <!-- Auth Buttons -->
        <div class="autho flex items-center gap-3 shrink-0">
            <?php if (!$isLoggedIn) {
                echo '<a href="login/login.php" class="bg-white font-bold text-gray-800 w-20 h-10 rounded-lg hover:text-blue-400 transition flex items-center justify-center">Log in</a>';
            } else {
                echo '<a href="logout.php" class="bg-white font-bold text-gray-800 w-20 h-10 rounded-lg hover:text-blue-400 transition flex items-center justify-center">Logout</a>';
            } ?>

        </div>
    </div>



    <!-- Main Layout Container -->
    <div class="main grid grid-cols-7 gap-4 m-32">
        <?php while ($row = $result->fetch_assoc()): ?>
            <div class="card group bg-[#f6f5f7] bg-opacity-30 backdrop-blur-md px-4 py-2 w-64 h-128 shadow-[0_4px_15px_0_rgba(0,0,0,0.2)]
            hover:shadow-[0_8px_25px_0_rgba(0,0,0,0.3)]
            hover:scale-105 hover:-translate-y-1
            transition-all duration-300 ease-out">
                <img src="<?php echo htmlspecialchars($row['cover_image']) ?>" class="w-full h-56 object-cover">
                <h3 class="font-bold text-xl mt-2"><?php echo htmlspecialchars($row['title']); ?></h3>
                <p class="font-thin text-sm"><?php echo htmlspecialchars($row['artist']); ?></p>
                <button
                    class="text-white bg-[#FF4B2B] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onclick="playsong('<?php echo htmlspecialchars($row['file_path']) ?>')"><i
                        class="fa-solid fa-play"></i></button>
            </div>
        <?php endwhile; ?>
    </div>

    <div
        class="playsong fixed bottom-0 left-0 right-0  shadow-[0_-6px_10px_-2px_rgba(0,0,0,0.3)] p-6 z-50  flex flex-col items-center justify-between bg-white">
        <div class="buttons flex items-center gap-4 text-xl">
            <button class="mr-4" id="likebtn"><i class="fa-solid fa-heart"></i></button>
            <button id="prebtn"><i class="fa-solid fa-backward-step"></i></button>
            <button id="playPauseBtn"><i class="fa-solid fa-play"></i></button>
            <button id="nextBtn"><i class="fa-solid fa-forward"></i></button>
            <button class="ml-4" id="repeatbtn"><i class="fas fa-repeat"></i></button>

        </div>
        <div class="audiobar w-full flex items-center gap-6 justify-between mt-1">
            <div class="w-[10%]"></div>
            <div class="bar w-[70%] flex items-center gap-2">
                <span class="timer">00:00</span>
                <input id="progressBar" type="range" min="0" max="100" value="0" class="w-full">
            </div>

            <div class="volume w-[10%] flex gap-2 item-center"><i class="fa-solid fa-volume-high"></i><input
                    id="volumeControl" type="range" min="0" max="1" step="0.01" value="1" class="w-full"></div>

        </div>

        <audio src="" id="audioPlayer" preload="metadata">

        </audio>
    </div>



    <script>
        const playPauseBtn = document.getElementById('playPauseBtn');
        const prebtn = document.getElementById('prebtn');
        const nextBtn = document.getElementById('nextBtn');
        const repeatBtn = document.getElementById('repeatbtn');
        const likebtn = document.getElementById('likebtn');
        const progressBar = document.getElementById('progressBar');
        const volumeControl = document.getElementById('volumeControl');
        const audioPlayer = document.getElementById('audioPlayer');

        function playsong(filePath) {
            audioPlayer.src = filePath;
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

        }






        playPauseBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            } else {
                audioPlayer.pause();
                playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            }
        })


        let repeatindex = 0;
        repeatBtn.addEventListener('click', () => {
            repeatindex = repeatindex === 0 ? 1 : 0;
            repeatBtn.classList.toggle('active');
            if (repeatindex) {
                audioPlayer.loop = true;
            } else {
                audioPlayer.loop = false;
            }
        });



        audioPlayer.addEventListener('timeupdate', () => {
            const currentTime = audioPlayer.currentTime;
            const duration = audioPlayer.duration;
            const progress = (currentTime / duration) * 100;
            progressBar.value = progress;

        })

    </script>
</body>


</html>