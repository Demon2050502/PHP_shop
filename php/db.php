<?php
$host = 'localhost';
$db = 'my_shop';
$user = 'root';
$pass = 'root';

// Создаем подключение
$conn = new mysqli($host, $user, $pass, $db);

// Проверяем подключение
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}

// Устанавливаем кодировку
$conn->set_charset("utf8mb4");
?>