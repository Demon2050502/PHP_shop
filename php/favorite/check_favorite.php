<?php
header('Content-Type: application/json');
require '../db.php';

// Проверяем наличие обязательных параметров
if (!isset($_GET['user_id']) || !isset($_GET['product_id'])) {
    http_response_code(400);
    echo json_encode(false);
    exit();
}

$userId = $_GET['user_id'];
$productId = $_GET['product_id'];

try {
    // Проверка, есть ли запись в избранном
    $query = "SELECT * FROM favorites WHERE user_id = ? AND product_id = ?";
    $stmt = $conn->prepare($query); 
    if (!$stmt) {
        throw new Exception("Ошибка подготовки запроса");
    }
    
    $stmt->bind_param("ii", $userId, $productId);
    if (!$stmt->execute()) {
        throw new Exception("Ошибка выполнения запроса");
    }
    
    $result = $stmt->get_result();
    $isFavorite = $result->num_rows > 0;

    echo json_encode($isFavorite);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(false);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
?>