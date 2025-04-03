<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Не авторизован']);
    exit;
}

require_once 'db.php';

try {
    // Подготавливаем запрос
    $stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Ошибка подготовки запроса: " . $conn->error);
    }
    
    // Привязываем параметры
    $stmt->bind_param("i", $_SESSION['user_id']);
    
    // Выполняем запрос
    if (!$stmt->execute()) {
        throw new Exception("Ошибка выполнения запроса: " . $stmt->error);
    }
    
    // Получаем результат
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Пользователь не найден']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'username' => $user['username'] ?? 'Пользователь'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка сервера',
        'error' => $e->getMessage()
    ]);
} finally {
    // Закрываем соединение
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>