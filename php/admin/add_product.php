<?php
require '../db.php';

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? 0;
    $category = $_POST['category'] ?? '';
    $image = $_POST['image'] ?? '';
    $description = $_POST['description'] ?? '';
    
    $stmt = $conn->prepare("INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sdsss", $name, $price, $category, $image, $description);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Товар успешно добавлен';
    } else {
        $response['message'] = 'Ошибка при добавлении товара';
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>