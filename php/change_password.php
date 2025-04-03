<?php
session_start();
header('Content-Type: application/json');

// Включаем вывод ошибок для отладки (убрать в продакшене)
ini_set('display_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Не авторизован']);
    exit;
}

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);
$oldPassword = $data['old_password'] ?? '';
$newPassword = $data['new_password'] ?? '';

if (empty($oldPassword) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Все поля обязательны']);
    exit;
}

if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'message' => 'Пароль должен содержать минимум 6 символов']);
    exit;
}

require_once 'db.php';

// Проверяем старый пароль
$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Ошибка подготовки запроса: ' . $conn->error]);
    exit;
}

$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Пользователь не найден']);
    exit;
}

if (!password_verify($oldPassword, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Неверный текущий пароль']);
    exit;
}

// Обновляем пароль
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Ошибка подготовки запроса: ' . $conn->error]);
    exit;
}

$stmt->bind_param("si", $hashedPassword, $_SESSION['user_id']);
$stmt->execute();

if ($stmt->affected_rows === 1) {
    echo json_encode(['success' => true, 'message' => 'Пароль успешно изменен']);
} else {
    echo json_encode(['success' => false, 'message' => 'Не удалось обновить пароль']);
}

$stmt->close();
$conn->close();
?>