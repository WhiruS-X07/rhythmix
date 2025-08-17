<?php
include("header.php");
include("backend.php");
?>

<body class=" bg-[#f6f5f7] text-black">

    <!-- ✅ Fixed Top Navbar -->
    <div
        class="fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between bg-[#f6f5f7] bg-opacity-30 px-4 py-2  shadow-xl z-20">

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
            <button id="uploadBtn">Upload</button>
            <div
                class="model hidden fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-50 flex justify-center items-center m-4 rounded-lg">
                <div
                    class="modelContent fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-30 backdrop-blur-md z-50 flex justify-center items-center m-4 rounded-lg">
                    <span class="closeBtn cursor-pointer text-2xl bg-white bg-opacity-30 backdrop-blur-md rounded-full p-1 fixed bottom-0 my-10 hover:shadow-[0_8px_25px_0_rgba(0,0,0,0.3)]
            hover:scale-105 hover:-translate-y-1
            transition-all duration-300 ease-out"><i class="fa-solid fa-xmark"></i></span>
                    <iframe src="" id="uploadFrame"></iframe>
                </div>
            </div>
            <?php if (!$isLoggedIn) {
                echo '<a href="login/login.php" class="bg-white font-bold text-gray-800 w-20 h-10 rounded-lg hover:text-blue-400 transition flex items-center justify-center">Log in</a>';
            } else {
                echo '<a href="login/logout.php" class="bg-white font-bold text-gray-800 w-20 h-10 rounded-lg hover:text-blue-400 transition flex items-center justify-center">Logout</a>';
            } ?>

        </div>
    </div>



    <!-- Main Layout Container -->
    <div class="main grid gap-6 px-4 mt-28 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
        <?php while ($row = $result->fetch_assoc()): ?>
            <div class="card relative group bg-white bg-opacity-30 backdrop-blur-md px-4 py-4 w-64 h-128 
            hover:shadow-lg
            hover:scale-105 hover:-translate-y-1
            transition-all duration-300 ease-out">
                <img src="<?php echo htmlspecialchars($row['cover_image']) ?>" class="w-full h-56 object-cover">
                <h3 class="font-bold text-xl mt-2"><?php echo htmlspecialchars($row['title']); ?></h3>
                <p class="font-thin text-sm"><?php echo htmlspecialchars($row['artist']); ?></p>
                <button
                    class="text-white bg-[#FF4B2B] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 fixed bottom-0 right-0 m-4"
                    data-file="<?php echo htmlspecialchars($row['file_path']); ?>"
                    data-title="<?php echo htmlspecialchars($row['title']); ?>"
                    data-artist="<?php echo htmlspecialchars($row['artist']); ?>" onclick="playFromButton(this)"><i
                        class="fa-solid fa-play"></i></button>
            </div>
        <?php endwhile; ?>
    </div>

    <!-- ✅ Player -->
    <div class="player absolute z-50 hidden w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/5 
            p-6 rounded-2xl 
            bg-black bg-opacity-20 backdrop-blur-md shadow-lg text-black 
            flex flex-col items-center justify-between cursor-move" style="top: 100px; left: 100px;">


        <div class="player-top flex items-center justify-between w-full mb-4">
            <div class="song-info flex flex-col items-start">
                <h2 id="title" class="text-2xl font-bold">Song Title</h2>
                <p id="artist">Artist Name</p>
            </div>
            <div class="controls flex items-center gap-5 text-2xl mr-4">
                <button id="likeBtn"><i class="fa-regular fa-heart"></i></button>
                <button id="prevBtn"><i class="fa-solid fa-backward-step"></i></button>
                <button id="playBtn"><i class="fa-solid fa-play"></i></button>
                <button id="nextBtn"><i class="fa-solid fa-forward-step"></i></button>
                <button id="repeatBtn"><i class="fa-solid fa-repeat"></i></button>
                <button id="closeBtn" class="fixed top-0 right-0 m-2 text-base text-black text-opacity-40"><i
                        class="fa-solid fa-xmark"></i></button>
            </div>

        </div>

        <div class="player-bar flex items-center gap-2 w-full">
            <div class="time">
                <span id="current-time">0:00</span>
            </div>
            <div class="progress-container bg-[#333] h-[5px] w-full cursor-pointer overflow-hidden border border-[#333] rounded-[5px]"
                id="progress-container">
                <div class="progress bg-white bg-opacity-50 h-full w-[0%]" id="progress"></div>
            </div>


            <div class="time">
                <span id="duration">0:00</span>
            </div>
        </div>

    </div>

    <audio id="audioPlayer" src="" preload="metadata"></audio>



    <!-- <div class="volume w-[10%] flex gap-2 item-center"><i class="fa-solid fa-volume-high"></i><input
                    id="volumeControl" type="range" min="0" max="1" step="0.01" value="1" class="w-full"></div> -->


    <script src="script.js"></script>
</body>


</html>