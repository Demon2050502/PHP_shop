<?php
session_start();
require 'db.php'; // Подключаем базу данных

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Проверяем, есть ли такой email или логин
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        echo "Ошибка: такой email или логин уже существует!";
        exit();
    }
    $stmt->close();

    // Хешируем пароль
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Добавляем пользователя в базу
    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashed_password);
    
    if ($stmt->execute()) {
        $user_id = $stmt->insert_id; // Получаем ID нового пользователя
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;
        
        
        echo "<script>
            localStorage.setItem('authToken',  $user_id);
            window.location.href = '../review.html';
        </script>";
        exit();
    } else {
        echo "Ошибка при регистрации!";
    }
    $stmt->close();
}

$conn->close();
?>