<?php
// Initialize the session
session_start(['cookie_httponly' => true]);

// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;
}

header("Access-Control-Allow-Origin: ".$_SERVER["HTTP_HOST"]);
header("X-Frame-Options: Deny");
?>

<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.0/js/bootstrap.min.js"></script>
<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> 

<div class="container">
    <div class="span3 well">
        <center>
        <img src="https://i.ytimg.com/vi/jllUYAjIiYg/maxresdefault.jpg" name="aboutme" width="140" height="140" class="img-circle"></a>
        <h2><?php echo htmlspecialchars($_SESSION["username"]); ?></h2>
		</center>
	<br>
	<center>
	<?php if($_SESSION["username"] === "admin") : ?>
		<h2>You beat the admin again: zh3r0{4dm1n_h4tes_car_st34l3rs_br0}</h2>
	<?php endif; ?>
	<center><h2><a href="logout.php" class="btn btn-danger ml-3">Sign Out of Your Account</a></center>
	<h2></div>
</div>
