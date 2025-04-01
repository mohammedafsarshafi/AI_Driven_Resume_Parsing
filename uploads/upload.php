<?php
require 'config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
session_start();
if (!isset($_SESSION['usermail']) && $method !== 'LOGOUT') {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access.']);
    exit;
}

try {
    switch ($method) {
        case 'POST':
            // Handle File Upload
            $username = $_SESSION['usermail'];

            // Prepare and execute the query to fetch the user ID
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
            $stmt->bindValue(':email', $username, PDO::PARAM_STR);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check if the user exists
            if (!$user) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid user email.']);
                exit;
            }

            $user_id = $user['id']; // Get the user ID from the database

            if (isset($_FILES['resume'])) {
                $uploadDir = 'uploads/';

                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $fileName = basename($_FILES['resume']['name']);
                $fileTmpName = $_FILES['resume']['tmp_name'];
                $fileSize = $_FILES['resume']['size'];
                $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                $allowedTypes = ['pdf', 'doc', 'docx'];

                if (!in_array($fileType, $allowedTypes)) {
                    echo json_encode(['status' => 'error', 'message' => 'Only PDF, DOC, and DOCX files are allowed.']);
                    exit;
                }

                if ($fileSize > 5 * 1024 * 1024) {
                    echo json_encode(['status' => 'error', 'message' => 'File size should not exceed 5MB.']);
                    exit;
                }

                $uniqueFileName = time() . '_' . $fileName;
                $filePath = $uploadDir . $uniqueFileName;

                if (move_uploaded_file($fileTmpName, $filePath)) {
                    $stmt = $conn->prepare("INSERT INTO resumes (user_id, file_name, file_path) VALUES (:user_id, :file_name, :file_path)");
                    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
                    $stmt->bindValue(':file_name', $fileName, PDO::PARAM_STR);
                    $stmt->bindValue(':file_path', $filePath, PDO::PARAM_STR);
                    $stmt->execute();
                    echo json_encode(['status' => 'success', 'message' => 'Resume uploaded successfully!']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Failed to move uploaded file.']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No file uploaded.']);
            }
            break;

        case 'GET':
            if (isset($_GET['action']) && $_GET['action'] == 'list') {
                // Handle File Upload
                $username = $_SESSION['usermail'];

                // Prepare and execute the query to fetch the user ID
                $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
                $stmt->bindValue(':email', $username, PDO::PARAM_STR);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                // Check if the user exists
                if (!$user) {
                    echo json_encode(['status' => 'error', 'message' => 'Invalid user email.']);
                    exit;
                }

                $user_id = $user['id']; // Get the user ID from the database

                // List Resumes
                $stmt = $conn->prepare("SELECT * FROM resumes WHERE user_id = :user_id ORDER BY uploaded_at DESC");
                $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT); // Bind the user_id parameter
                $stmt->execute();
                $resumes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($resumes);
            } elseif (isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['id'])) {
                // Delete Resume
                $id = $_GET['id'];
                $stmt = $conn->prepare("SELECT file_path FROM resumes WHERE id = :id");
                $stmt->bindValue(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
                $file = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($file && file_exists($file['file_path'])) {
                    unlink($file['file_path']); // Delete file
                    $stmt = $conn->prepare("DELETE FROM resumes WHERE id = :id");
                    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
                    $stmt->execute();
                    echo json_encode(['status' => 'success', 'message' => 'File deleted.']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'File not found.']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
            }
            break;

        case 'LOGOUT':
            // Handle Logout
            session_destroy();
            header('Location: /Registration/index.html'); // Corrected path
            exit;

        default:
            echo json_encode(['status' => 'error', 'message' => 'Unsupported request method.']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
