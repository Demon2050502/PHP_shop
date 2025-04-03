<?php
require '../db.php';

$product = ['name' => '', 'price' => '', 'category' => '', 'image' => '', 'description' => ''];
$action = 'add';
$title = 'Добавить товар';

if (isset($_GET['product_id'])) {
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $_GET['product_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();
    $action = 'update';
    $title = 'Редактировать товар';
}
?>

<h2><?= $title ?></h2>
<form id="product-form" data-action="<?= $action ?>">
    <?php if ($action === 'update'): ?>
    <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
    <?php endif; ?>
    <div class="form-group">
        <label>Название:</label>
        <input type="text" name="name" value="<?= htmlspecialchars($product['name']) ?>" required>
    </div>
    <div class="form-group">
        <label>Цена:</label>
        <input type="number" step="0.01" name="price" value="<?= $product['price'] ?>" required>
    </div>
    <div class="form-group">
        <label>Категория:</label>
        <input type="text" name="category" value="<?= htmlspecialchars($product['category']) ?>" required>
    </div>
    <div class="form-group">
        <label>Изображение (URL):</label>
        <input type="text" name="image" value="<?= htmlspecialchars($product['image']) ?>" required>
    </div>
    <div class="form-group">
        <label>Описание:</label>
        <textarea name="description"><?= htmlspecialchars($product['description']) ?></textarea>
    </div>
    <button type="submit" class="submit-btn"><?= $title ?></button>
    <?php if ($action === 'update'): ?>
    <button type="button" class="cancel-btn" onclick="loadProductForm()">Отмена</button>
    <?php endif; ?>
</form>