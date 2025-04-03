<?php
session_start();
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$productId = $data['productId'];
$quantity = $data['quantity'];
$userId = $data['userId'];

// Проверка авторизации через сессию
if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] != $userId) {
    die(json_encode(['status' => 'error', 'message' => 'Неавторизованный доступ']));
}

// Проверка существования товара
$productCheck = $conn->prepare("SELECT id FROM products WHERE id = ?");
$productCheck->bind_param("i", $productId);
$productCheck->execute();
$productCheck->store_result();

if ($productCheck->num_rows === 0) {
    die(json_encode(['status' => 'error', 'message' => 'Товар не найден']));
}

// Проверка корзины
$checkSql = "SELECT id, quantity FROM cart WHERE product_id = ? AND user_id = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("ii", $productId, $userId);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows > 0) {
    // Обновляем количество если товар уже в корзине
    $row = $result->fetch_assoc();
    $newQuantity = $row['quantity'] + $quantity;
    
    $updateSql = "UPDATE cart SET quantity = ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("ii", $newQuantity, $row['id']);
    
    if ($updateStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Количество обновлено']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка обновления']);
    }
} else {
    // Добавляем новый товар
    $insertSql = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
    $insertStmt = $conn->prepare($insertSql);
    $insertStmt->bind_param("iii", $userId, $productId, $quantity);
    
    if ($insertStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Товар добавлен']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ошибка добавления']);
    }
}

$conn->close();
?>