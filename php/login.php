<?php
session_start();
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Проверяем, что данные переданы
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        die("Ошибка: данные формы не переданы.");
    }

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    

    // Проверяем, что поля не пустые
    if (empty($username) || empty($password)) {
        die("Ошибка: имя пользователя и пароль не могут быть пустыми.");
    }

    // Ищем пользователя в базе данных
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $username, $hashed_password);
        $stmt->fetch();

        error_log("Password: " . $password);
        
        // Проверяем пароль
        if (password_verify($password, $hashed_password)) {
            // Успешный вход
            $_SESSION['user_id'] = $user_id;
            $_SESSION['username'] = $username;
            echo "<script>
                localStorage.setItem('authToken',  $user_id);
                window.location.href = '../review.html';
            </script>";
            exit();
        } else {
            echo "Неверный пароль!";
        }
    } else {
        echo "Пользователь не найден!";
    }

    $stmt->close();
} else {
    echo "Ошибка: неверный метод запроса.";
}

$conn->close();
?>