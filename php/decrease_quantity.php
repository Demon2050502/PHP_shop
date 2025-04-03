<?php
require 'db.php';

$cartId = $_GET['id'];

// Получаем текущее количество товара
$sql = "SELECT quantity FROM cart WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $cartId);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$currentQuantity = $row['quantity'];

// Уменьшаем количество на 1
$newQuantity = $currentQuantity - 1;

if ($newQuantity <= 0) {
    // Если количество стало 0 или меньше, удаляем товар из корзины
    $deleteSql = "DELETE FROM cart WHERE id = ?";
    $deleteStmt = $conn->prepare($deleteSql);
    $deleteStmt->bind_param("i", $cartId);

    if ($deleteStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Товар удален из корзины']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка при удалении товара']);
    }

    $deleteStmt->close();
} else {
    // Если количество больше 0, обновляем его
    $updateSql = "UPDATE cart SET quantity = ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("ii", $newQuantity, $cartId);

    if ($updateStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Количество уменьшено']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка при уменьшении количества']);
    }

    $updateStmt->close();
}

$stmt->close();
$conn->close();
?>