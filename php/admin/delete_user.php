<?php
require '../db.php';

header('Content-Type: application/json');
$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'] ?? null;
    
    if (!$user_id) {
        $response['message'] = 'Не указан ID пользователя';
        echo json_encode($response);
        exit;
    }

    // Для MySQLi отключаем autocommit вместо beginTransaction()
    $conn->autocommit(FALSE);
    $error = false;
    
    try {
        // Удаляем корзину пользователя
        $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        if (!$stmt->execute()) $error = true;
        
        // Удаляем избранное пользователя
        $stmt = $conn->prepare("DELETE FROM favorites WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        if (!$stmt->execute()) $error = true;
        
        // Удаляем самого пользователя (кроме админов)
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND is_admin = FALSE");
        $stmt->bind_param("i", $user_id);
        if (!$stmt->execute()) $error = true;
        
        if ($stmt->affected_rows > 0 && !$error) {
            $conn->commit();
            $response['success'] = true;
            $response['message'] = 'Пользователь успешно удален';
        } else {
            $conn->rollback();
            $response['message'] = 'Пользователь не найден или это администратор';
        }
    } catch (Exception $e) {
        $conn->rollback();
        $response['message'] = 'Ошибка при удалении пользователя: ' . $e->getMessage();
    } finally {
        $conn->autocommit(TRUE);
    }
} else {
    $response['message'] = 'Некорректный метод запроса';
}

echo json_encode($response);
?>