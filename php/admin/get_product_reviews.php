<?php
require '../db.php';

$product_id = $_GET['product_id'] ?? 0;

$sql = "SELECT r.*, u.username as user_name 
        FROM reviews r 
        LEFT JOIN users u ON r.user_id = u.id 
        WHERE r.product_id = ? 
        ORDER BY r.created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $product_id);
$stmt->execute();
$result = $stmt->get_result();

echo '<div id="reviews-list" data-product-id="'.$product_id.'">';

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $stars = str_repeat('★', $row["rating"]) . str_repeat('☆', 5 - $row["rating"]);
        echo '<div class="review-item">
                <div class="review-header">
                    <span class="review-user">'.htmlspecialchars($row["user_name"] ?? 'Аноним').'</span>
                    <span class="review-date">'.date("d.m.Y H:i", strtotime($row["created_at"])).'</span>
                </div>
                <div class="review-rating">'.$stars.'</div>
                <div class="review-text">'.htmlspecialchars($row["text"]).'</div>
                <button class="delete-review-btn" data-id="'.$row["id"].'">Удалить</button>
              </div>';
    }
} else {
    echo '<p>Нет отзывов для этого товара</p>';
}

echo '</div>';

$stmt->close();
$conn->close();
?>