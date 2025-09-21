<?php
include("includes/header.php");
include("includes/backend.php");
?>

<body class=" bg-[#0D0F12] text-white">

    <!-- ✅ Fixed Top Navbar -->
    <div class="nav fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between 
    px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28 py-3 z-20" data-aos="fade-down" data-aos-duration="700"
        data-aos-easing="ease-out-cubic">
        <!-- Home + Search -->
        <div class="flex items-center gap-3 sm:gap-4 shrink min-w-0" data-aos="fade-right" data-aos-delay="200">
            <a href="#" class="home bg-[#1A1F25] rounded-full p-2 sm:p-3 text-lg sm:text-xl md:text-2xl transition"
                data-aos="zoom-in" data-aos-delay="300">
                <i class="fa-solid fa-house"></i>
            </a>
            <div class="relative flex items-center justify-center" data-aos="fade-left" data-aos-delay="400">
                <input type="text" id="searchfield" placeholder="Search..." class="searchfield" />
                <div class="search"></div>
            </div>
        </div>
        <!-- Logo Section -->
        <div class="logo flex items-center gap-2 sm:gap-3 shrink-0" data-aos="fade-left" data-aos-delay="600">
            <img src="assets/logo.png" alt="logo" class="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16">
            <h1 class="font-bold text-xl sm:text-2xl md:text-3xl">Rhythmix</h1>
        </div>
        <!-- Auth Buttons -->
        <div class="autho flex items-center gap-2 sm:gap-3 shrink-0">
            <?php if (!$isLoggedIn) {
                echo '<a href="user-auth/login.php" class="bg-white font-bold text-gray-800 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:text-blue-400 transition text-sm sm:text-base">Log in</a>';
            } else {
                echo '<a href="#" class="bg-white font-bold text-gray-800 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:text-blue-400 transition text-sm sm:text-base">Logout</a>';
            } ?>
        </div>

    </div>

    <!-- Nav Bar for Mobile -->
    <div class="mobile-nav hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 z-20">

        <!-- Menu Button -->
        <div class="relative">
            <button id="mobileMenuBtn" class="text-xl transition">
                <i class="fa-solid fa-bars"></i>
            </button>

            <!-- Dropdown Menu -->
            <div id="mobileMenu" class="hidden absolute top-full left-0 bg-white shadow-lg rounded-lg mt-2 p-4 w-40">
                <a href="#" class="block text-black hover:text-blue-400 transition mb-2">Home</a>
                <a href="#" class="block text-black hover:text-blue-400 transition mb-2">Log in</a>
                <!-- <a href="login/logout.php" class="block text-black hover:text-blue-400 transition">Logout</a> -->
            </div>
        </div>

        <!-- Logo -->
        <div class="logo flex items-center gap-3 shrink-0">
            <img src="assets/logo.png" alt="logo" class="w-16 h-16">
            <h1 class="font-bold text-2xl">Rhythmix</h1>
        </div>
    </div>


    <!-- Main Layout Container -->
    <div class="main bg-[#1A1F25] fixed top-20 left-0 right-0 bottom-10 overflow-hidden flex flex-col rounded-xl w-[90%] mx-auto 
         mt-2 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8" data-aos="fade-up" data-aos-duration="800"
        data-aos-easing="ease-out-cubic">

        <div class="nav-conatiner bg-[#2A313B] absolute top-0 right-0 left-0 h-14 z-30 mb-2" data-aos="fade-down"
            data-aos-delay="200">
            <ul class="flex gap-4 sm:gap-6 px-6 sm:px-10 md:px-16 py-3">
                <li id="home-nav" class="active-nav px-2 flex items-center font-bold rounded-2xl" data-aos="fade-right"
                    data-aos-delay="300">Home</li>
                <li id="playlist-nav" class="non-active-nav px-2 py-1 font-bold rounded-2xl" data-aos="fade-right"
                    data-aos-delay="400">Playlist</li>
                <li id="artist-nav" class="non-active-nav px-2 py-1 font-bold rounded-2xl" data-aos="fade-right"
                    data-aos-delay="500">Artist</li>
                <li id="history-nav" class="non-active-nav px-2 py-1 font-bold rounded-2xl" data-aos="fade-right"
                    data-aos-delay="600">History</li>
            </ul>
        </div>

        <section class="home overflow-y-auto scrollbar-hide m-10">
            <h2 class="font-extrabold text-lg sm:text-lg md:text-2xl lg:text-3xl pt-4" data-aos="fade-up" data-aos-delay="200">Fresh & New</h2>
            <div id="p-1" class="sideScroll" data-aos="fade-up" data-aos-delay="400"></div>

            <h2 class="font-extrabold text-md sm:text-md md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl pt-4" data-aos="fade-up" data-aos-delay="600">Indie</h2>
            <div id="p-2" class="sideScroll" data-aos="fade-up" data-aos-delay="800"></div>

            <h2 class="font-extrabold text-md sm:text-md md:text-lg lg:text-xl xl:text-xl 2xl:text-3xl pt-4" data-aos="fade-up" data-aos-delay="1000">Chill Zone</h2>
            <div id="p-3" class="sideScroll" data-aos="fade-up" data-aos-delay="1200"></div>
        </section>
    </div>


    <div
        class="queue hidden fixed right-0 top-0 h-full  w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white bg-opacity-30 backdrop-blur-md z-40 p-4">
        <h2 class="text-2xl font-bold mb-4">Queue</h2>
        <ul id="queueList" class="list-disc pl-5">
        </ul>
    </div>

    <!-- ✅ Player -->
    <div class="player absolute z-50 hidden w-full h-40 md:w-1/2 lg:w-[55%] xl:w-2/5 2xl:w-1/4 3xl p-6 rounded-2xl 
            bg-white bg-opacity-20 backdrop-blur-md shadow-lg text-black 
            flex flex-col items-center justify-between cursor-move" style="top: 80%; left: 40%" data-aos="zoom-in-up"
        data-aos-duration="800" data-aos-delay="300">


        <div class="player-top flex items-center justify-between w-full my-2">
            <div class="song-info flex flex-col items-start">
                <h2 id="title" class="text-2xl font-bold">Song Title</h2>
                <p id="artist">Artist Name</p>
            </div>
            <div class="controls flex items-center gap-5 text-2xl lg:text-xl mr-4">
                <!-- <button id="likeBtn"><i class="fa-regular fa-heart"></i></button> -->
                <button id="prevBtn"><i class="fa-solid fa-backward-step"></i></button>
                <button id="playBtn"><i class="fa-solid fa-play"></i></button>
                <button id="nextBtn"><i class="fa-solid fa-forward-step"></i></button>
                <button id="repeatBtn"><i class="fa-solid fa-rotate-right"></i></button>
                <button id="queuebtn"><i class="fa-solid fa-list"></i></button>
                <button id="closeBtn" class="fixed top-0 right-0 m-2 text-base text-black text-opacity-40"><i
                        class="fa-solid fa-xmark"></i></button>
            </div>

        </div>

        <div class="player-bar flex items-center gap-2 w-full">
            <div class="time">
                <span id="current-time">0:00</span>
            </div>
            <div class="progress-container bg-[#333] h-[5px] w-full cursor-pointer overflow-hidden rounded-[5px]"
                id="progress-container">
                <div class="progress bg-white bg-opacity-50 h-full w-[0%]" id="progress">
                </div>
            </div>
            <div class="time">
                <span id="duration">0:00</span>
            </div>
        </div>

    </div>

    <!-- ✅ Player Mobile (Minimal with unique IDs) -->
    <div class="player-mobile hidden fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50">

        <!-- Top Controls -->
        <div class="flex items-center justify-between mb-3">
            <div>
                <h2 id="title-mobile">Song Title</h2>
                <p id="artist-mobile">Artist Name</p>
            </div>
            <div class="flex items-center gap-3">
                <!-- <button id="likeBtn-mobile"><i class="fa-regular fa-heart"></i></button> -->
                <button id="prevBtn-mobile"><i class="fa-solid fa-backward-step"></i></button>
                <button id="playBtn-mobile"><i class="fa-solid fa-play"></i></button>
                <button id="nextBtn-mobile"><i class="fa-solid fa-forward-step"></i></button>
                <button id="repeatBtn-mobile"><i class="fa-solid fa-rotate-right"></i></button>
                <button id="queuebtn-mobile"><i class="fa-solid fa-list"></i></button>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="flex items-center gap-2 w-full">
            <span id="current-time-mobile">0:00</span>
            <div id="progress-container-mobile" class="bg-gray-600 h-[4px] w-full cursor-pointer rounded">
                <div id="progress-mobile" class="bg-white h-full w-[0%]"></div>
            </div>
            <span id="duration-mobile">0:00</span>
        </div>
    </div>



    <audio id="audioPlayer" src="" preload="metadata"></audio>



    <!-- <div class="volume w-[10%] flex gap-2 item-center"><i class="fa-solid fa-volume-high"></i><input
                    id="volumeControl" type="range" min="0" max="1" step="0.01" value="1" class="w-full"></div> -->



    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init();
    </script>
    <script src="script.js"></script>
    <!-- <script src="api.js"></script> -->
</body>


</html>