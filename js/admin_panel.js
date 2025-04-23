document.addEventListener("DOMContentLoaded", function () {
  loadAuthData();
  loadTabContent("products");

  // Обработчики для переключения вкладок
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

function loadAuthData() {
  fetch("../php/check_auth.php")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      const authButtons = document.getElementById("authButtons");
      if (data.authenticated) {
        authButtons.innerHTML = `
                    <span>${data.username}</span>
                    <a href="../php/logout.php">Выйти</a>
                `;
      } else {
        authButtons.innerHTML = '<a href="login.html">Вход / Регистрация</a>';
      }
    })
    .catch((error) => {
      console.error("Error loading auth data:", error);
    });
}

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
    case "reviews":
      loadProductsWithReviews();
      break;
  }
}

// Функции для работы с товарами
function loadProductForm(productId = null) {
  let url = "../php/admin/get_product_form.php";
  if (productId) url += `?product_id=${productId}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text || "Ошибка сервера");
        });
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById("product-form-container").innerHTML = html;
      setupProductForm();
    })
    .catch((error) => {
      console.error("Ошибка загрузки формы:", error);
      showMessage("Ошибка: " + error.message, "error");
    });
}

function loadProducts() {
  fetch("../php/admin/get_products.php")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then((html) => {
      document.getElementById("products-list-container").innerHTML = html;
      setupProductActions();
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      showMessage("Ошибка загрузки товаров", "error");
    });
}

function setupProductForm() {
  const form = document.getElementById("product-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const action = this.getAttribute("data-action");

      fetch(`../php/admin/${action}_product.php`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            showMessage(
              data.message || "Операция выполнена успешно",
              "success"
            );
            loadProducts();
            if (action === "add") {
              loadProductForm();
            }
          } else {
            showMessage(data.message || "Произошла ошибка", "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showMessage("Ошибка при выполнении операции", "error");
        });
    });
  }
}

function setupProductActions() {
  document.querySelectorAll(".edit-product-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      if (!productId) {
        showMessage("Не удалось определить ID товара", "error");
        return;
      }
      loadProductForm(productId);
    });
  });

  document.querySelectorAll(".delete-product-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const productId = this.getAttribute("data-id");
      if (!productId) {
        showMessage("Не удалось определить ID товара", "error");
        return;
      }

      if (!confirm("Вы уверены, что хотите удалить этот товар?")) {
        return;
      }

      try {
        const response = await fetch("../php/admin/delete_product.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `product_id=${encodeURIComponent(productId)}`,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}\n${errorText}`
          );
        }

        const data = await response.json();

        if (data.success) {
          showMessage(data.message || "Товар успешно удален", "success");
          loadProducts();
        } else {
          showMessage(data.message || "Ошибка при удалении товара", "error");
        }
      } catch (error) {
        console.error("Ошибка при удалении товара:", error);
        showMessage(
          "Ошибка при удалении товара. Проверьте консоль для подробностей.",
          "error"
        );
      }
    });
  });
}

// Функции для работы с пользователями
function loadUsers() {
  fetch("../php/admin/get_users.php")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then((html) => {
      document.getElementById("users-list-container").innerHTML = html;
      setupUserActions();
    })
    .catch((error) => {
      console.error("Error loading users:", error);
      showMessage("Ошибка загрузки пользователей", "error");
    });
}

function setupUserActions() {
  // Удаление пользователя
  document.querySelectorAll(".delete-user-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const userId = this.getAttribute("data-id");
      if (!userId) {
        showMessage("Не удалось определить ID пользователя", "error");
        return;
      }

      if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
        return;
      }

      try {
        const response = await fetch("../php/admin/delete_user.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `user_id=${encodeURIComponent(userId)}`,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}\n${errorText}`
          );
        }

        const data = await response.json();

        if (data.success) {
          showMessage(data.message || "Пользователь успешно удален", "success");
          loadUsers();
        } else {
          showMessage(
            data.message || "Ошибка при удалении пользователя",
            "error"
          );
        }
      } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        showMessage(
          "Ошибка при удалении пользователя. Проверьте консоль для подробностей.",
          "error"
        );
      }
    });
  });
}

// Функции для работы с заказами
function loadOrders() {
  fetch("../php/admin/get_orders.php")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then((html) => {
      document.getElementById("orders-list-container").innerHTML = html;
    })
    .catch((error) => {
      console.error("Error loading orders:", error);
      showMessage("Ошибка загрузки заказов", "error");
    });
}

// Общая функция для показа сообщений
function showMessage(text, type = "success") {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 5000);
}

// Загрузка товаров с количеством отзывов
function loadProductsWithReviews() {
  fetch("../php/admin/get_products_with_reviews.php")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then((html) => {
      document.getElementById("products-with-reviews").innerHTML = html;
      setupProductReviewsActions();
    })
    .catch((error) => {
      console.error("Error loading products with reviews:", error);
      showMessage("Ошибка загрузки товаров с отзывами", "error");
    });
}

function setupBackButton() {
  const backButton = document.getElementById("back-to-products");
  if (backButton) {
    backButton.addEventListener("click", function () {
      document.getElementById("products-with-reviews").style.display = "block";
      document.getElementById("reviews-list-container").style.display = "none";
    });
  }
}

function loadProductReviews(productId, productName) {
  fetch(`../php/admin/get_product_reviews.php?product_id=${productId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then((html) => {
      document.getElementById("products-with-reviews").style.display = "none";
      document.getElementById("reviews-list-container").style.display = "block";
      document.getElementById("current-product-name").textContent = productName;
      document.getElementById("reviews-list").innerHTML = html;
      document
        .getElementById("reviews-list")
        .setAttribute("data-product-id", productId);

      // Назначаем обработчики после загрузки контента
      setupReviewActions();
      setupBackButton(); // Добавляем обработчик для кнопки "Назад"
    })
    .catch((error) => {
      console.error("Error loading product reviews:", error);
      showMessage("Ошибка загрузки отзывов", "error");
    });
}

// Настройка обработчиков для удаления отзывов
function setupReviewActions() {
  document.querySelectorAll(".delete-review-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const reviewId = this.getAttribute("data-id");
      if (!reviewId) {
        showMessage("Не удалось определить ID отзыва", "error");
        return;
      }

      try {
        const response = await fetch("../php/admin/delete_review.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `review_id=${encodeURIComponent(reviewId)}`,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}\n${errorText}`
          );
        }

        const data = await response.json();

        if (data.success) {
          const productId = document
            .querySelector("#reviews-list")
            .getAttribute("data-product-id");
          const productName = document.getElementById(
            "current-product-name"
          ).textContent;
          // Перезагружаем отзывы для этого товара
          loadProductReviews(productId, productName);
        } else {
          showMessage(data.message || "Ошибка при удалении отзыва", "error");
        }
      } catch (error) {
        console.error("Ошибка при удалении отзыва:", error);
        showMessage(
          "Ошибка при удалении отзыва. Проверьте консоль для подробностей.",
          "error"
        );
      }
    });
  });
}

function setupProductActions() {
  document.querySelectorAll(".edit-product-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      if (!productId) {
        showMessage("Не удалось определить ID товара", "error");
        return;
      }
      loadProductForm(productId);
    });
  });

  document.querySelectorAll(".delete-product-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const productId = this.getAttribute("data-id");
      if (!productId) {
        showMessage("Не удалось определить ID товара", "error");
        return;
      }

      if (!confirm("Вы уверены, что хотите удалить этот товар?")) {
        return;
      }

      try {
        const response = await fetch("../php/admin/delete_product.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `product_id=${encodeURIComponent(productId)}`,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}\n${errorText}`
          );
        }

        const data = await response.json();

        if (data.success) {
          showMessage(data.message || "Товар успешно удален", "success");
          // Обновляем список товаров и отзывов
          const activeTab = document
            .querySelector(".tab-btn.active")
            .getAttribute("data-tab");
          loadTabContent(activeTab);
        } else {
          showMessage(data.message || "Ошибка при удалении товара", "error");
        }
      } catch (error) {
        console.error("Ошибка при удалении товара:", error);
        showMessage(
          "Ошибка при удалении товара. Проверьте консоль для подробностей.",
          "error"
        );
      }
    });
  });
}

function setupProductReviewsActions() {
  document.querySelectorAll(".show-reviews-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      const productName = this.getAttribute("data-name");
      loadProductReviews(productId, productName);
    });
  });
}
