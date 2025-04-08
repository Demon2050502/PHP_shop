<?php
require '../db.php';

$cartId = $_GET['id'];

// Увеличиваем количество на 1
$sql = "UPDATE cart SET quantity = quantity + 1 WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $cartId);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Количество увеличено']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка при увеличении количества']);
}

$stmt->close();
$conn->close();
?>