<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['resume'])) {
    echo "File received: " . $_FILES['resume']['name'];
} else {
    echo "No file received!";
}
?>