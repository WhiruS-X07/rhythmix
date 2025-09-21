<?php
include('../includes/header.php');
include('../includes/config.php');

session_start();
session_unset();

if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $db_pass = $row['password'];

        if (password_verify($password, $db_pass)) {
            session_regenerate_id(true);

            $_SESSION['user_id'] = $row['id'];
            $_SESSION['user_name'] = $row['name'];
            $_SESSION['user_email'] = $row['email'];
            $_SESSION['logged_in_time'] = time();

            header("Location: ../index.php");
            exit;
        } else {
            $error = "Invalid password.";
        }
    } else {
        $error = "No account found with that email.";
    }

    $stmt->close();
    $conn->close();
}
?>


<body class="bg-[#0D0F12] text-white flex items-center justify-center min-h-screen">
    <form data-aos="fade-up" data-aos-duration="1200"
        class="flex flex-col items-center justify-center w-[90%] max-w-md p-8 rounded-2xl shadow-lg bg-[#1A1D21] space-y-6"
        action="login.php" method="POST">

        <!-- Logo -->
        <div data-aos="zoom-in" class="logo flex flex-col items-center justify-center gap-3">
            <img src="../assets/logo.png" alt="logo" class="w-32">
            <h1 class="font-bold text-2xl md:text-3xl">Sign in to Rhythmix</h1>
        </div>

        <!-- Inputs -->
        <div data-aos="fade-right" class="flex flex-col w-full space-y-4 pt-8">
            <input
                class="w-full p-3 rounded-full bg-[#0D0F12] border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="email" name="email" placeholder="Email Address" required />
            <input
                class="w-full p-3 rounded-full bg-[#0D0F12] border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                type="password" name="password" placeholder="Password" required />
            <a href="" class="text-sm text-gray-400 hover:text-blue-400 transition self-end">
                Forgot your password?
            </a>
        </div>

        <!-- Button -->
        <button data-aos="fade-left" type="submit" name="signin"
            class="w-full p-3 rounded-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 transition font-semibold">
            Sign In
        </button>

        <!-- Divider -->
        <div class="flex items-center w-full my-4" data-aos="fade-up" data-aos-delay="200">
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
            <a href="" data-aos="flip-right" data-aos-delay="400"
                class="flex items-center justify-center gap-3 w-full p-3 rounded-full border border-gray-600 hover:bg-gray-800 transition">
                <i class="fa-brands fa-apple text-gray-200 text-lg"></i>
                <span>Sign in with Apple</span>
            </a>
        </div>

        <!-- Register link -->
        <p data-aos="fade-up" data-aos-delay="500" class="text-sm text-gray-400 pt-6">
            Don’t have an account?
            <a href="register.php" class="text-blue-400 hover:underline">Register here</a>
        </p>
    </form>

    <!-- AOS Script -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init();
    </script>
</body>

</html>