<?php
session_start();
include "config.php";

// Password validation regex
$passwordRegex = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";

// **Registration**
if (isset($_POST['register'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $mobile = $_POST['mobile'];
    $password = $_POST['password'];

    // Validate password
    if (!preg_match($passwordRegex, $password)) {
        echo "<script>alert('Password must be 8+ chars with uppercase, lowercase, number, and special char.'); window.location.href='index.html';</script>";
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Check if the email already exists
    $checkEmail = "SELECT * FROM users WHERE email='$email'";
    $resultEmail = $conn->query($checkEmail);

    // Check if the mobile number already exists
    $checkMobile = "SELECT * FROM users WHERE mobile='$mobile'";
    $resultMobile = $conn->query($checkMobile);

    if ($resultEmail->num_rows > 0) {
        echo "<script>alert('Email already registered! Try logging in.'); window.location.href='index.html';</script>";
    } elseif ($resultMobile->num_rows > 0) {
        echo "<script>alert('Mobile number already registered!'); window.location.href='index.html';</script>";
    } else {
        $sql = "INSERT INTO users (name, email, mobile, password) VALUES ('$name', '$email', '$mobile', '$hashedPassword')";
        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Registration successful! Redirecting to login.'); window.location.href='index.html';</script>";
        } else {
            echo "<script>alert('Error: " . $conn->error . "'); window.location.href='index.html';</script>";
        }
    }
}

// **Login**
if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['usermail'] = $email;
            echo "<script>alert('Login successful!'); window.location.href='/afsar/index.html';</script>";
        } else {
            echo "<script>alert('Invalid credentials!'); window.location.href='index.html';</script>";
        }
    } else {
        echo "<script>alert('User not found!'); window.location.href='index.html';</script>";
    }
}

// **Forgot Password (Simulated OTP)**
if (isset($_POST['forgot'])) {
    $email = $_POST['email'];
    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "<script>alert('OTP sent to your email (simulated).'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Email not registered!'); window.location.href='index.html';</script>";
    }
}
?>
