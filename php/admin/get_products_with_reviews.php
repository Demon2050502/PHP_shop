<?php
require '../db.php';

$sql = "SELECT p.id, p.name, COUNT(r.id) as review_count 
        FROM products p 
        LEFT JOIN reviews r ON p.id = r.product_id 
        GROUP BY p.id 
        HAVING review_count > 0 
        ORDER BY review_count DESC";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo '<div class="product-review-item" data-id="'.$row["id"].'">
                <div class="product-review-name">'.$row["name"].'</div>
                <div class="product-review-count">Отзывов: '.$row["review_count"].'</div>
                <button class="show-reviews-btn" data-id="'.$row["id"].'" data-name="'.$row["name"].'">Просмотреть отзывы</button>
              </div>';
    }
} else {
    echo '<p>Нет товаров с отзывами</p>';
}
$conn->close();
?>