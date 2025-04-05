<?php
require '../db.php';

header('Content-Type: text/html');

$query = "SELECT c.id, u.username, p.name, p.price, c.quantity 
          FROM cart c
          JOIN users u ON c.user_id = u.id
          JOIN products p ON c.product_id = p.id
          ORDER BY c.id DESC";

$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    echo '<table class="admin-table">
        <thead>
            <tr>
                <th>ID заказа</th>
                <th>Пользователь</th>
                <th>Товар</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Сумма</th>
            </tr>
        </thead>
        <tbody>';
    
    while ($order = $result->fetch_assoc()) {
        $total = $order['price'] * $order['quantity'];
        echo '<tr>
            <td>'.$order['id'].'</td>
            <td>'.htmlspecialchars($order['username']).'</td>
            <td>'.htmlspecialchars($order['name']).'</td>
            <td>'.number_format($order['price'], 2).' ₽</td>
            <td>'.$order['quantity'].'</td>
            <td>'.number_format($total, 2).' ₽</td>
        </tr>';
    }
    
    echo '</tbody></table>';
} else {
    echo '<p>Нет активных заказов</p>';
}

// Закрываем соединение
$conn->close();
?>