<?php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$productId = $data['productId'];
$userId = $data['userId'];
$text = $data['text'];

// Проверяем, что текст отзыва не пустой
if (empty($text)) {
    echo json_encode(['status' => 'error', 'message' => 'Текст отзыва не может быть пустым']);
    exit;
}

// Добавляем отзыв в базу данных
$sql = "INSERT INTO reviews (product_id, user_id, text) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iis", $productId, $userId, $text);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Отзыв успешно добавлен']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка при добавлении отзыва']);
}

$stmt->close();
$conn->close();
?>