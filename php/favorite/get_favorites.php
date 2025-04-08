<?php
session_start();
require_once '../db.php';

// Проверяем, авторизован ли пользователь
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Пользователь не авторизован']);
    exit;
}

$userId = $_SESSION['user_id'];

// Получаем избранные товары с данными о товарах
$stmt = $conn->prepare("
    SELECT p.id, p.name, p.image, p.price 
    FROM favorites f
    JOIN products p ON f.product_id = p.id
    WHERE f.user_id = ?
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$favorites = [];
while ($row = $result->fetch_assoc()) {
    $favorites[] = $row;
}

echo json_encode(['status' => 'success', 'favorites' => $favorites]);

$stmt->close();
$conn->close();
?>