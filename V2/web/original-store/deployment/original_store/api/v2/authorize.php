<?php
require_once ("../../config.php");
session_start();
 
// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: ../../login.php");
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("X-Frame-Options: Deny");
header("Content-Type: text/json");

$user = $_SESSION["username"];

print '{"username":"'.htmlspecialchars($user).'", "error":"This endpoint is currently out of use because of previous issues."}';

header("Location: ../../home.php")
?>

