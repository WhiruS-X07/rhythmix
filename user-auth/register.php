<?php
include('../includes/header.php');
include('../includes/config.php');
?>

<body class="bg-[#0D0F12] text-white flex items-center justify-center min-h-screen">
    <form data-aos="fade-up" data-aos-duration="1200"
        class="flex flex-col items-center justify-center w-[90%] max-w-md p-8 rounded-2xl shadow-lg bg-[#1A1D21] space-y-6"
        action="register.php" method="POST">

        <!-- Logo -->
        <div data-aos="zoom-in" class="logo flex flex-col items-center justify-center gap-3">
            <img src="../assets/logo.png" alt="logo" class="w-32">
            <h1 class="font-bold text-center text-2xl md:text-3xl">Create your Rhythmix Account</h1>
        </div>


        <!-- Inputs -->
        <div class="flex flex-col w-full space-y-4 pt-8">
            <input class="w-full p-3 rounded-full bg-[#0D0F12] border border-gray-700 focus:border-blue-500 
                 focus:ring-2 focus:ring-blue-500 outline-none transition" type="text" name="username"
                placeholder="Username" required />

            <input class="w-full p-3 rounded-full bg-[#0D0F12] border border-gray-700 focus:border-blue-500 
                 focus:ring-2 focus:ring-blue-500 outline-none transition" type="email" name="email"
                placeholder="Email Address" required />

            <input class="w-full p-3 rounded-full bg-[#0D0F12] border border-gray-700 focus:border-blue-500 
                 focus:ring-2 focus:ring-blue-500 outline-none transition" type="password" name="password"
                placeholder="Password" required />

            <input class="w-full p-3 rounded-full bg-[#0D0F12] border border-gray-700 focus:border-blue-500 
                 focus:ring-2 focus:ring-blue-500 outline-none transition" type="password" name="confirm_password"
                placeholder="Re-confirm Password" required />
        </div>

        <!-- Get OTP Button -->
        <button id="get-otp-btn" type="button" class="w-full p-3 rounded-full bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500 
             transition font-semibold">
            Get OTP
        </button>

        <!-- OTP Section (Hidden Initially) -->
        <div id="otp-section" class="hidden w-full space-y-4" data-aos="fade-up" data-aos-delay="300">
            <p class="text-sm text-gray-400">Enter the 6-digit OTP sent to your email</p>
            <div class="flex justify-between gap-2">
                <input maxlength="1" type="text" class="otp-input w-12 h-12 text-center text-xl rounded-lg 
               bg-[#0D0F12] border border-gray-700 focus:border-blue-500 focus:ring-2 
               focus:ring-blue-500 outline-none" />
                <input maxlength="1" type="text" class="otp-input w-12 h-12 text-center text-xl rounded-lg 
               bg-[#0D0F12] border border-gray-700 focus:border-blue-500 focus:ring-2 
               focus:ring-blue-500 outline-none" />
                <input maxlength="1" type="text" class="otp-input w-12 h-12 text-center text-xl rounded-lg 
               bg-[#0D0F12] border border-gray-700 focus:border-blue-500 focus:ring-2 
               focus:ring-blue-500 outline-none" />
                <input maxlength="1" type="text" class="otp-input w-12 h-12 text-center text-xl rounded-lg 
               bg-[#0D0F12] border border-gray-700 focus:border-blue-500 focus:ring-2 
               focus:ring-blue-500 outline-none" />
                <input maxlength="1" type="text" class="otp-input w-12 h-12 text-center text-xl rounded-lg 
               bg-[#0D0F12] border border-gray-700 focus:border-blue-500 focus:ring-2 
               focus:ring-blue-500 outline-none" />
                <input maxlength="1" type="text" class="otp-input w-12 h-12 text-center text-xl rounded-lg 
               bg-[#0D0F12] border border-gray-700 focus:border-blue-500 focus:ring-2 
               focus:ring-blue-500 outline-none" />
            </div>

            <!-- Resend OTP -->
            <button type="button" class="flex items-center justify-center gap-2 w-full p-3 rounded-full bg-gray-700 
               hover:bg-gray-800 transition font-medium">
                <i class="fa-solid fa-rotate-right"></i> Resend OTP
            </button>
        </div>

        <!-- Register Button (Hidden Initially) -->
        <button id="register-btn" type="submit" name="register" class="hidden w-full p-3 rounded-full bg-blue-600 hover:bg-blue-700 focus:ring-4 
             focus:ring-blue-500 transition font-semibold">
            Register
        </button>

        <!-- Divider -->
        <div class="flex items-center w-full my-4">
            <div class="flex-grow h-px bg-gray-700"></div>
            <span class="px-3 text-gray-400 text-sm">or continue with</span>
            <div class="flex-grow h-px bg-gray-700"></div>
        </div>

        <!-- OAuth Buttons -->
        <div class="flex flex-col space-y-3 w-full">
            <!-- Google -->
            <a href="" data-aos="flip-left" data-aos-delay="300"
                class="flex items-center justify-center gap-3 w-full p-3 rounded-full border border-gray-600 hover:bg-gray-800 transition">
                <i class="fa-brands fa-google text-lg 
                    bg-[conic-gradient(from_-45deg,#ea4335_110deg,#4285f4_90deg_180deg,#34a853_180deg_270deg,#fbbc05_270deg)] 
                    bg-[73%_55%/150%_150%_no-repeat] 
                    bg-clip-text text-transparent"></i>
                <span>Sign in with Google</span>
            </a>

            <!-- Apple -->
            <a href="" data-aos="flip-right" data-aos-delay="300" class="flex items-center justify-center gap-3 w-full p-3 rounded-full border 
               border-gray-600 hover:bg-gray-800 transition">
                <i class="fa-brands fa-apple text-gray-200 text-lg"></i>
                <span>Register with Apple</span>
            </a>
        </div>

        <!-- Login link -->
        <p data-aos="fade-up" data-aos-delay="400" class="text-sm text-gray-400 pt-6">
            Already have an account?
            <a href="login.php" class="text-blue-400 hover:underline">Sign in here</a>
        </p>
    </form>

    <script src="https://cdn.tailwindcss.com"></script>
    <!-- AOS Script -->

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init();

        // Handle OTP show/hide
        const getOtpBtn = document.getElementById("get-otp-btn");
        const otpSection = document.getElementById("otp-section");
        const registerBtn = document.getElementById("register-btn");

        getOtpBtn.addEventListener("click", () => {
            getOtpBtn.classList.add("hidden");
            otpSection.classList.remove("hidden");
            registerBtn.classList.remove("hidden");
        });

        // OTP Auto-focus logic
        const inputs = document.querySelectorAll(".otp-input");
        inputs.forEach((input, index) => {
            input.addEventListener("input", (e) => {
                if (e.target.value && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !input.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    </script>
</body>

</html>