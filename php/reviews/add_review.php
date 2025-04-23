<?php
require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$productId = $data['productId'];
$token = $data['token'];
$text = $data['text'];
$rating = $data['rating'] ?? null;

// Получаем имя пользователя из базы данных
$userName = 'Аноним';
$userQuery = $conn->prepare("SELECT username FROM users WHERE id = ?");
$userQuery->bind_param("i", $token);
$userQuery->execute();
$userResult = $userQuery->get_result();
if ($userResult->num_rows > 0) {
    $userData = $userResult->fetch_assoc();
    $userName = $userData['username'];
}

// Добавляем отзыв
$sql = "INSERT INTO reviews (product_id, user_id, user_name, text, rating) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iissi", $productId, $token, $userName, $text, $rating);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Отзыв успешно добавлен']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка при добавлении отзыва: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>