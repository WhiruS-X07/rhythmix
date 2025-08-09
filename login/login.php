<?php include("../config.php");

session_start();

// Check if the form was submitted
if (isset($_POST['signup'])) {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash password

    // Insert into database
    $sql = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";

    if (mysqli_query($conn, $sql)) {
        $message = "<p class='success'>✅ Registration successful! You can now log in.</p>";
    } else {
        $message = "<p class='error'>❌ Error: " . mysqli_error($conn) . "</p>";
    }
}


// Check if the form was submitted
if (isset($_POST['signin'])) {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];

    // Get user from database
    $sql = "SELECT * FROM users WHERE email = '$email' LIMIT 1";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) === 1) {
        $user = mysqli_fetch_assoc($result);

        // Verify password
        if (password_verify($password, $user['password'])) {
            // Store session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            // Redirect to dashboard
            header("Location: ../index.php");
            exit;
        } else {
            $message = "<p style='color:red;'>❌ Incorrect password!</p>";
        }
    } else {
        $message = "<p style='color:red;'>❌ No account found with that email!</p>";
    }
}
?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rhythmix - Sign In / Sign Up</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <h2>🎵 Welcome to Rhythmix</h2>
    <div class="container" id="container">
       
        <!-- Sign Up Form -->
        <div class="form-container sign-up-container">
            <form action="login.php" method="POST">
                <h1>Create Your Account</h1>
                <span>Join and start streaming your favorite tracks</span>
                <input type="text" name="name" placeholder="Full Name" required />
                <input type="email" name="email" placeholder="Email Address" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit" name="signup">Sign Up</button>
            </form>
        </div>

        <!-- Sign In Form -->
        <div class="form-container sign-in-container">
            <form action="login.php" method="POST">
                <h1>Sign In to Rhythmix</h1>
                <span>Welcome back! Log in to continue</span>
                <input type="email" name="email" placeholder="Email Address" required />
                <input type="password" name="password" placeholder="Password" required />
                <a href="forgot-password.php">Forgot your password?</a>
                <button type="submit" name="signin">Sign In</button>
            </form>
        </div>

        <!-- Overlay Section -->
        <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-panel overlay-left">
                    <h1>Welcome Back!</h1>
                    <p>Log in to enjoy your personalized playlists and music library</p>
                    <button class="ghost" id="signIn">Sign In</button>
                </div>
                <div class="overlay-panel overlay-right">
                    <h1>Hello, Music Lover!</h1>
                    <p>Create an account to explore unlimited songs and playlists</p>
                    <button class="ghost" id="signUp">Sign Up</button>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <p>
            © 2025 Rhythmix. All rights reserved.
        </p>
    </footer>

    <script src="script.js"></script>
</body>

</html>