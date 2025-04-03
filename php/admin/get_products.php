<?php
require '../db.php';

$products = $conn->query("SELECT * FROM products ORDER BY id DESC");

if ($products->num_rows > 0) {
    echo '<h2>Список товаров</h2>
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Название</th>
                      <th>Цена</th>
                      <th>Категория</th>
                      <th>Действия</th>
                  </tr>
              </thead>
              <tbody>';

    while($product = $products->fetch_assoc()) {
        echo '<tr>
                  <td>'.$product['id'].'</td>
                  <td>'.htmlspecialchars($product['name']).'</td>
                  <td>'.number_format($product['price'], 2).' ₽</td>
                  <td>'.htmlspecialchars($product['category']).'</td>
                  <td class="actions">
                      <button class="edit-product-btn" data-id="'.$product['id'].'">✏️</button>
                      <button class="delete-product-btn" data-id="'.$product['id'].'">🗑️</button>
                  </td>
              </tr>';
    }

    echo '</tbody></table>';
} else {
    echo '<p>Нет товаров</p>';
}
?>