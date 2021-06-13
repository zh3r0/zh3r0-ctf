<?php
require_once ("../../config.php");
header('P3P: CP="CAO PSA OUR"');
session_start(['cookie_httponly' => true]);
header('Set-Cookie: PHPSESSID=' . session_id() . '; SameSite=None; Secure; httponly');
 
// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: ../../login.php");
    exit;
}

if($_SERVER["HTTP_ORIGIN"] == "null"){
    header("Access-Control-Allow-Origin: null");
} else {
    header("Access-Control-Allow-Origin: ".$_SERVER["HTTP_HOST"]);
}
	
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding, Origin");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: text/json");

$user = $_SESSION["username"];
$user_sanitized = mysqli_real_escape_string($link, $user);
$sql = "SELECT password FROM users WHERE username='".$user_sanitized."'";
$result = mysqli_query($link, $sql);
$row = mysqli_fetch_array($result);

foreach ($row as $password){
	print '{"username":"'.htmlspecialchars($user_sanitized).'", "password":"'.htmlspecialchars($password).'"}';
	break;
    }
?>

