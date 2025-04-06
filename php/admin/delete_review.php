<?php
require '../db.php';

$review_id = $_POST['review_id'] ?? 0;

$sql = "DELETE FROM reviews WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $review_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Отзыв успешно удален']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при удалении отзыва']);
}

$stmt->close();
$conn->close();
?>