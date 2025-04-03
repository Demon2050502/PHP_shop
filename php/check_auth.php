<?php
session_start();
require 'db.php';

$response = ['authenticated' => false];

if (isset($_SESSION['user_id'])) {
    // Проверяем, является ли пользователь администратором
    $stmt = $conn->prepare("SELECT username, is_admin FROM users WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        $response['authenticated'] = true;
        $response['username'] = $user['username'];
        $response['is_admin'] = (bool)$user['is_admin'];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>