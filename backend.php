<?php
session_start();
include("config.php");

$sql = "SELECT * FROM music";
$result = $conn->query($sql);


$isLoggedIn = isset($_SESSION['user_id']); // true if logged in
if ($isLoggedIn) {
    $userId = (int) $_SESSION['user_id'];
    $sql_user = "SELECT * FROM users WHERE id = " . $_SESSION['user_id'];
    $result_user = $conn->query($sql_user);
}


?>