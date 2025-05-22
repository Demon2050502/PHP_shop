<?php
session_start();
require 'db.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['username']) || !isset($_POST['email']) || !isset($_POST['password'])) {
        $response['message'] = "Ошибка: не все данные переданы.";
        echo json_encode($response);
        exit();
    }

    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($email) || empty($password)) {
        $response['message'] = "Ошибка: все поля обязательны для заполнения.";
        echo json_encode($response);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = "Ошибка: неверный формат email.";
        echo json_encode($response);
        exit();
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $response['message'] = "Ошибка: такой email или логин уже существует!";
        echo json_encode($response);
        $stmt->close();
        exit();
    }
    $stmt->close();

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashed_password);
    
    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;
        
        $response['success'] = true;
        $response['user_id'] = $user_id;
        $response['redirect'] = '../review.html';
    } else {
        $response['message'] = "Ошибка при регистрации: " . $conn->error;
    }
    $stmt->close();
} else {
    $response['message'] = "Ошибка: неверный метод запроса.";
}

echo json_encode($response);
$conn->close();
?>