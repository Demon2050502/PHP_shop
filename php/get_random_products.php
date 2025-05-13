<?php
require 'db.php';

$result = $conn->query("SELECT * FROM products ORDER BY RAND() LIMIT 3");

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);
$conn->close();
?>