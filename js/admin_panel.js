// Загрузка данных при открытии страницы
document.addEventListener("DOMContentLoaded", function () {
  loadAuthData();
  loadTabContent("products");

  // Обработчики вкладок
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab-btn, .tab-content").forEach((el) => {
        el.classList.remove("active");
      });
      this.classList.add("active");
      const tabId = this.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
      loadTabContent(tabId);
    });
  });
});

// Загрузка данных авторизации
function loadAuthData() {
  fetch("php/check_auth.php")
    .then((response) => response.json())
    .then((data) => {
      const authButtons = document.getElementById("authButtons");
      if (data.authenticated) {
        let adminLink = data.is_admin
          ? '<a href="admin_panel.php" class="admin-link">Админ-панель</a>'
          : "";
        authButtons.innerHTML = `
                    <span>${data.username}</span>
                    ${adminLink}
                    <a href="php/logout.php">Выйти</a>
                `;
      } else {
        authButtons.innerHTML = '<a href="login.html">Вход / Регистрация</a>';
      }
    });
}

// Загрузка контента вкладки
function loadTabContent(tabId) {
  switch (tabId) {
    case "products":
      loadProductForm();
      loadProducts();
      break;
    case "users":
      loadUsers();
      break;
    case "orders":
      loadOrders();
      break;
  }
}

// Загрузка формы товара
function loadProductForm(productId = null) {
  let url = "php/admin/get_product_form.php";
  if (productId) url += `?product_id=${productId}`;

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("product-form-container").innerHTML = html;
      setupProductForm();
    });
}

// Загрузка списка товаров
function loadProducts() {
  fetch("php/admin/get_products.php")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("products-list-container").innerHTML = html;
      setupProductActions();
    });
}

// Настройка формы товара
function setupProductForm() {
  const form = document.getElementById("product-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const action = this.getAttribute("data-action");

      fetch(`php/admin/${action}_product.php`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          showMessage(data.message, data.success ? "success" : "error");
          if (data.success) {
            loadProducts();
            if (action === "add") loadProductForm();
          }
        });
    });
  }
}

// Настройка действий с товарами
function setupProductActions() {
  document.querySelectorAll(".edit-product").forEach((btn) => {
    btn.addEventListener("click", function () {
      loadProductForm(this.dataset.id);
    });
  });

  document.querySelectorAll(".delete-product").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (confirm("Удалить товар?")) {
        fetch("php/admin/delete_product.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `product_id=${this.dataset.id}`,
        })
          .then((response) => response.json())
          .then((data) => {
            showMessage(data.message, data.success ? "success" : "error");
            if (data.success) loadProducts();
          });
      }
    });
  });
}

// Показать сообщение
function showMessage(text, type = "success") {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 2000);
}
