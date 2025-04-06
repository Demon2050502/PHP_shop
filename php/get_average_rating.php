<?php
require 'db.php';

$productId = $_GET['productId'] ?? 0;

// Получаем средний рейтинг и количество отзывов
$sql = "SELECT AVG(rating) as averageRating, COUNT(*) as reviewsCount FROM reviews WHERE product_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $productId);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode([
    'averageRating' => (float)$data['averageRating'],
    'reviewsCount' => (int)$data['reviewsCount']
]);

$stmt->close();
$conn->close();
?>