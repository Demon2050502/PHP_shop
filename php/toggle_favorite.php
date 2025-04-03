<?php
header('Content-Type: application/json');
require 'db.php';

// Получаем данные из запроса
$data = json_decode(file_get_contents('php://input'), true);
$userId = $data['userId'] ?? null;
$productId = $data['productId'] ?? null;
$isFavorite = $data['isFavorite'] ?? false;

// Проверка авторизации
session_start();
if (!isset($_SESSION['user_id'])) {
    die(json_encode(['success' => 'false', 'message' => 'Необходимо авторизоваться']));
}

if ($_SESSION['user_id'] != $userId) {
    die(json_encode(['success' => 'false', 'message' => 'Доступ запрещен']));
}

try {
    if ($isFavorite) {
        // Проверяем, нет ли уже этого товара в избранном
        $check = $conn->prepare("SELECT * FROM favorites WHERE user_id = ? AND product_id = ?");
        $check->bind_param("ii", $userId, $productId);
        $check->execute();
        
        if ($check->get_result()->num_rows === 0) {
            $stmt = $conn->prepare("INSERT INTO favorites (user_id, product_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $userId, $productId);
            $stmt->execute();
        }
        echo json_encode(['success' => 'true']);
    } else {
        // Удаляем из избранного
        $stmt = $conn->prepare("DELETE FROM favorites WHERE user_id = ? AND product_id = ?");
        $stmt->bind_param("ii", $userId, $productId);
        $stmt->execute();
        echo json_encode(['success' => 'true']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => 'false', 'message' => 'Ошибка сервера: ' . $e->getMessage()]);
} finally {
    // Закрываем соединения
    if (isset($stmt)) $stmt->close();
    if (isset($check)) $check->close();
    $conn->close();
}
?>