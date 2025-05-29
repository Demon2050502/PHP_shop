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
    <link rel="stylesheet" href="style/main_style/main.css" />
</head>

<body>
    <header>
        <button class="menu-toggle" id="menuToggle">
            <img src="img_sait/header/menu-icon.svg" alt="Меню" />
        </button>

        <div class="auth-buttons" id="authButtons"></div>

        <div class="overlay" id="overlay"></div>

        <nav id="mainNav">
            <a href="index.html" class="active">
                <img src="img_sait/header/icon_home.svg" alt="Главная" />
                <span>Главная</span>
            </a>
            <a href="basket.html">
                <img src="img_sait/header/icon_basket.svg" alt="Корзина" />
                <span>Корзина</span>
            </a>
            <a href="favourite.html">
                <img src="img_sait/header/icon_favourite.svg" alt="Избранное" />
                <span>Избранное</span>
            </a>
            <a href="office.html">
                <img src="img_sait/header/icon_office.svg" alt="Кабинет" />
                <span>Кабинет</span>
            </a>
            <a href="review.html">
                <img src="img_sait/header/icon_review.svg" alt="Отзывы" />
                <span>Отзывы</span>
            </a>
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

    <script src="js/main_js/header.js"></script>

    <script src="js/admin_panel.js"></script>
</body>

</html>