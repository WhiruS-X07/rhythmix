<?php
session_start(); // Start the session to access session variables

// Unset all session variables to log out the user
session_unset();

// Destroy the session to ensure no data is retained
session_destroy();

// Clear the session cookie for better security
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params(); // Get current session cookie parameters
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Redirect the user back to the home page or login page
header("Location: index.php");
exit(); // Terminate the script after redirection
?>