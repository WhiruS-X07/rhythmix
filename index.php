<?php
include("header.php");
include("backend.php");
?>

<body class=" bg-[#f6f5f7] text-black">

    <!-- ✅ Fixed Top Navbar -->
    <div
        class="fixed top-0 left-0 right-0 flex items-center justify-between bg-[#f6f5f7] bg-opacity-30 px-4 py-2  shadow-xl z-20">

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
    <div class="main grid grid-cols-7 gap-4 m-32">
        <?php while ($row = $result->fetch_assoc()): ?>
            <div class="card group bg-white bg-opacity-30 backdrop-blur-md px-4 py-2 w-64 h-128 shadow-[0_4px_15px_0_rgba(0,0,0,0.2)]
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
        class="playsong fixed bottom-0 left-0 right-0 shadow-[0_-6px_10px_-2px_rgba(0,0,0,0.3)] p-6 z-10  flex flex-col items-center justify-between bg-white">
        <div class="buttons flex items-center gap-4 text-xl">
            <button class="mr-4" id="likebtn"><i class="fa-solid fa-heart"></i></button>
            <button id="prebtn"><i class="fa-solid fa-backward-step"></i></button>
            <button id="playPauseBtn"><i class="fa-solid fa-play"></i></button>
            <button id="nextBtn"><i class="fa-solid fa-forward-step"></i></button>
            <button class="ml-4" id="repeatbtn"><i class="fas fa-repeat"></i></button>
            <button class="ml-4" id="listbtn"><i class="fa-solid fa-list"></i></button>
            <div
                class="queue hidden fixed z-50 top-1/2 left-1/2 right-0 bottom-0 bg-white shadow-[0_4px_15px_0_rgba(0,0,0,0.2)] mb-32 mr-96 flex justify-center items-center  rounded-lg ">
                <span
                    class="closeBtn cursor-pointer text-2xl rounded-full p-1 fixed hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out top-1/2 right-0 mr-96 p-4"><i
                        class="fa-solid fa-xmark"></i></span>
            </div>
        </div>
        <div class="audiobar w-full flex items-center gap-6 justify-between mt-1">
            <div class="w-[10%]"></div>
            <div class="bar w-[50%] flex items-center gap-2">
                <span class="timer">00:00</span>
                <input id="progressBar" type="range" min="0" max="100" value="0" class="w-full">
            </div>

            <div class="volume w-[10%] flex gap-2 item-center"><i class="fa-solid fa-volume-high"></i><input
                    id="volumeControl" type="range" min="0" max="1" step="0.01" value="1" class="w-full"></div>

        </div>

        <audio src="" id="audioPlayer" preload="metadata">

        </audio>
    </div>
    <script src="script.js"></script>
</body>


</html>