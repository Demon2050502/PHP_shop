<?php
require '../db.php';

header('Content-Type: text/html');

$result = $conn->query("SELECT id, username, email, created_at FROM users WHERE is_admin = FALSE ORDER BY id DESC");

if ($result && $result->num_rows > 0) {
    echo '<table class="admin-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Логин</th>
                <th>Email</th>
                <th>Дата регистрации</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>';
    
    while ($user = $result->fetch_assoc()) {
        echo '<tr>
            <td>'.$user['id'].'</td>
            <td>'.htmlspecialchars($user['username']).'</td>
            <td>'.htmlspecialchars($user['email']).'</td>
            <td>'.$user['created_at'].'</td>
            <td class="actions">
                <button class="delete-user-btn" data-id="'.$user['id'].'">🗑️ Удалить</button>
            </td>
        </tr>';
    }
    
    echo '</tbody></table>';
} else {
    echo '<p>Нет зарегистрированных пользователей</p>';
}

$conn->close();
?>