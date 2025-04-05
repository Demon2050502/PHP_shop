<?php
require '../db.php';

header('Content-Type: application/json');
$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = $_POST['product_id'] ?? null;
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? 0;
    $category = $_POST['category'] ?? '';
    $image = $_POST['image'] ?? '';
    $description = $_POST['description'] ?? '';
    
    if (!$product_id) {
        $response['message'] = 'Не указан ID товара';
        echo json_encode($response);
        exit;
    }

    // Исправляем на bind_param() для MySQLi
    $stmt = $conn->prepare("UPDATE products SET name = ?, price = ?, category = ?, image = ?, description = ? WHERE id = ?");
    
    // Правильный способ для MySQLi:
    $stmt->bind_param("sdsssi", $name, $price, $category, $image, $description, $product_id);
    // s - string, d - double, i - integer
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Товар успешно обновлен';
    } else {
        $response['message'] = 'Ошибка при обновлении товара: ' . $stmt->error;
    }
} else {
    $response['message'] = 'Некорректный метод запроса';
}

echo json_encode($response);