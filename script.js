document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").onsubmit = validateLogin;
    document.getElementById("registerForm").onsubmit = validateRegister;
    document.getElementById("forgotForm").onsubmit = validateForgot;

    document.getElementById("showRegisterLink").addEventListener("click", showRegister);
    document.getElementById("showLoginLink").addEventListener("click", showLogin);
    document.getElementById("forgotLink").addEventListener("click", showForgot);
    document.getElementById("backToLoginLink").addEventListener("click", showLogin);

    document.getElementById("regMobile").addEventListener("input", checkMobileNumber);
});

// Function to validate login
function validateLogin(event) {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    document.getElementById("loginEmailError").innerText = "";
    document.getElementById("loginPasswordError").innerText = "";

    if (!email.includes("@")) {
        document.getElementById("loginEmailError").innerText = "Enter a valid email.";
        event.preventDefault();
    }
    if (!passwordRegex.test(password)) {
        document.getElementById("loginPasswordError").innerText = "Password must be 8+ chars with uppercase, lowercase, number, and special char.";
        event.preventDefault();
    }
}

// Function to validate registration
function validateRegister(event) {
    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let mobile = document.getElementById("regMobile").value.trim();
    let password = document.getElementById("regPassword").value.trim();
    let confirmPassword = document.getElementById("regConfirmPassword").value.trim();
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let mobileError = document.getElementById("regMobileError");

    document.getElementById("regNameError").innerText = "";
    document.getElementById("regEmailError").innerText = "";
    document.getElementById("regMobileError").innerText = "";
    document.getElementById("regPasswordError").innerText = "";
    document.getElementById("regConfirmPasswordError").innerText = "";

    let hasError = false;

    if (name.length < 3) {
        document.getElementById("regNameError").innerText = "Enter a valid name (min 3 characters).";
        hasError = true;
    }
    if (!email.includes("@")) {
        document.getElementById("regEmailError").innerText = "Enter a valid email.";
        hasError = true;
    }
    if (!/^\d{10}$/.test(mobile)) {
        document.getElementById("regMobileError").innerText = "Enter a valid 10-digit mobile number.";
        hasError = true;
    }
    if (!passwordRegex.test(password)) {
        document.getElementById("regPasswordError").innerText = "Password must be 8+ chars with uppercase, lowercase, number, and special char.";
        hasError = true;
    }
    if (password !== confirmPassword) {
        document.getElementById("regConfirmPasswordError").innerText = "Passwords do not match.";
        hasError = true;
    }

    if (mobileError.innerText !== "") {
        hasError = true;
    }

    if (hasError) {
        event.preventDefault();
    } else {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "check_mobile.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText === "exists") {
                    mobileError.innerText = "Mobile number already registered.";
                    event.preventDefault();
                } else {
                    alert("Registration successful!");
                }
            }
        };
        xhr.send("mobile=" + mobile);
    }
}

// Function to validate forgot password
function validateForgot(event) {
    let email = document.getElementById("forgotEmail").value.trim();
    document.getElementById("forgotEmailError").innerText = "";

    if (!email.includes("@")) {
        document.getElementById("forgotEmailError").innerText = "Enter a valid email.";
        event.preventDefault();
    } else {
        alert("OTP sent successfully!");
    }
}

// Function to check if the mobile number is already registered (client-side check via AJAX)
function checkMobileNumber() {
    let mobile = document.getElementById("regMobile").value.trim();
    let mobileError = document.getElementById("regMobileError");

    if (/^\d{10}$/.test(mobile)) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "check_mobile.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText === "exists") {
                    mobileError.innerText = "Mobile number already registered.";
                } else {
                    mobileError.innerText = "";
                }
            }
        };
        xhr.send("mobile=" + mobile);
    } else {
        mobileError.innerText = "";
    }
}

// Page Navigation Functions
function showRegister() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "block";
    document.getElementById("forgotPage").style.display = "none";
}

function showLogin() {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("forgotPage").style.display = "none";
}

function showForgot() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("forgotPage").style.display = "block";
}
