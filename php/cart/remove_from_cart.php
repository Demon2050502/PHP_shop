<?php
header('Content-Type: application/json');

// Подключаем файл с соединением к БД
require_once '../db.php';

// Получаем ID записи в корзине из параметра запроса
$cartId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($cartId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Неверный ID товара']);
    exit;
}

try {
    // Подготовленный запрос для удаления товара из корзины
    $stmt = $conn->prepare("DELETE FROM cart WHERE id = ?");
    $stmt->bind_param("i", $cartId);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Товар удален из корзины']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Товар не найден в корзине']);
        }
    } else {
        throw new Exception('Ошибка при выполнении запроса');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка: ' . $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>