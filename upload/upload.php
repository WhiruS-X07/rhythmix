<?php
include("header.php");
include("config.php");

session_start();


if (!$isLoggedIn) {
    header("Location: login/login.php");
    exit();
} else {

}
?>

<body>
    
</body>

</html>