<?php
session_start();
require 'db.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Проверяем, что данные переданы
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        $response['message'] = "Ошибка: данные формы не переданы.";
        echo json_encode($response);
        exit();
    }

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Проверяем, что поля не пустые
    if (empty($username) || empty($password)) {
        $response['message'] = "Ошибка: имя пользователя и пароль не могут быть пустыми.";
        echo json_encode($response);
        exit();
    }

    // Ищем пользователя в базе данных
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $username, $hashed_password);
        $stmt->fetch();
        
        // Проверяем пароль
        if (password_verify($password, $hashed_password)) {
            // Успешный вход
            $_SESSION['user_id'] = $user_id;
            $_SESSION['username'] = $username;
            
            $response['success'] = true;
            $response['user_id'] = $user_id;
            $response['redirect'] = '../review.html';
        } else {
            $response['message'] = "Неверный пароль!";
        }
    } else {
        $response['message'] = "Пользователь не найден!";
    }

    $stmt->close();
} else {
    $response['message'] = "Ошибка: неверный метод запроса.";
}

echo json_encode($response);
$conn->close();
?>