<?php
session_start();
require 'php/db.php';

function isAdmin($user_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT is_admin FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    return $user['is_admin'] ?? false;
}

if (!isset($_SESSION['user_id']) || !isAdmin($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель</title>
    <link rel="stylesheet" href="style/style_admin.css">
    <link rel="stylesheet" href="style/main_style/header.css">
</head>

<body>
    <header>
        <div class="auth-buttons" id="authButtons"></div>
        <nav>
            <a href="basket.html"><img src="img_sait/icon_basket.svg"></a>
            <a href="favourite.html"><img src="img_sait/icon_favourite.svg"></a>
            <a href="office.html"><img src="img_sait/icon_office.svg"></a>
            <a href="review.html"><img src="img_sait/icon_review.svg"></a>
        </nav>
    </header>

    <div class="admin-container">
        <header class="admin-header">
            <h1>Админ-панель</h1>
            <nav class="admin-nav">
                <button class="tab-btn active" data-tab="products">Товары</button>
                <button class="tab-btn" data-tab="users">Пользователи</button>
                <button class="tab-btn" data-tab="orders">Заказы</button>
                <button class="tab-btn" data-tab="reviews">Отзывы</button>
                <a href="php/logout.php" class="logout-btn">Выйти</a>
            </nav>
        </header>

        <main class="admin-main">
            <section id="products" class="tab-content active">
                <div id="product-form-container"></div>
                <div id="products-list-container"></div>
            </section>

            <section id="users" class="tab-content">
                <div id="users-list-container"></div>
            </section>

            <section id="orders" class="tab-content">
                <div id="orders-list-container"></div>
            </section>

            <section id="reviews" class="tab-content">
                <div id="products-with-reviews" class="products-list"></div>
                <div id="reviews-list-container" class="reviews-list" style="display: none;">
                    <h3>Отзывы для товара: <span id="current-product-name"></span></h3>
                    <button id="back-to-products" class="back-btn">← Назад к списку товаров</button>
                    <div id="reviews-list"></div>
                </div>
            </section>
        </main>
    </div>

    <script src="js/admin_panel.js"></script>
</body>

</html>