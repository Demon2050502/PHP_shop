<?php
require '../db.php';

header('Content-Type: application/json');

try {
    $product_id = $_POST['product_id'] ?? null;
    
    if (!$product_id) {
        throw new Exception('Product ID is required');
    }
    
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Product deleted',
        'deleted_id' => $product_id
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>