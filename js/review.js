let products = []; // Глобальная переменная для хранения всех товаров

// Загрузка товаров с сервера
async function fetchProducts() {
  const response = await fetch("../php/get_products.php");
  const data = await response.json();
  return data.products || data;
}

// Функция для сортировки товаров
function sortProducts(products, key, order = "asc") {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.sort((a, b) => {
    let valueA, valueB;

    if (key === "price") {
      valueA = parseFloat(a.price); // Преобразуем в число
      valueB = parseFloat(b.price); // Преобразуем в число
      return order === "asc" ? valueA - valueB : valueB - valueA;
    } else if (key === "name") {
      valueA = a.name;
      valueB = b.name;
      return order === "asc"
        ? valueA.localeCompare(valueB, "ru", { sensitivity: "base" })
        : valueB.localeCompare(valueA, "ru", { sensitivity: "base" });
    }
    return 0;
  });
}

// Функция для фильтрации товаров
function applyFilters() {
  const selectedCategories = [];
  const selectedOffers = [];

  // Собираем выбранные категории
  document
    .querySelectorAll('.category-filter input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedCategories.push(checkbox.value);
    });

  // Собираем выбранные специальные предложения
  document
    .querySelectorAll('.special-offers-filter input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedOffers.push(checkbox.value);
    });

  // Фильтруем товары
  const filteredProducts = products.filter((product) => {
    // Проверка по категории
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    // Проверка по специальным предложениям
    const matchesOffer =
      selectedOffers.length === 0 ||
      selectedOffers.some((offer) => {
        if (offer === "discount" && product.discount) return true;
        if (offer === "new" && product.isNew) return true;
        if (offer === "bestseller" && product.isBestseller) return true;
        return false;
      });

    return matchesCategory && matchesOffer;
  });

  return filteredProducts;
}

// Функция для обновления отображения товаров
async function updateProductDisplay(productsToDisplay) {
  const productContainer = document.getElementById("productContainer");

  // Сначала получаем все данные об избранном
  const favoriteStatuses = await Promise.all(
    productsToDisplay.map((product) => checkFavorite(product.id))
  );

  // Затем рендерим карточки
  productContainer.innerHTML = productsToDisplay
    .map(
      (product, index) => `
      <div class="product-card" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <div class="price">${product.price} ₽</div>
          <div class="actions">
              <button class="open-reviews" onclick="openReviewModal(${
                product.id
              })">
                  <img src="img_sait/reviews.svg">
              </button>
              <button class="add-to-cart" onclick="addToCart(${
                product.id
              })">В корзину</button>
              <button class="add-to-favorite ${
                favoriteStatuses[index] ? "active" : ""
              }" 
                      onclick="toggleHeart(this, ${product.id})">
                  <svg class="heart-icon" id="heart-icon" viewBox="0 0 24 24" 
                       fill="${favoriteStatuses[index] ? "red" : "none"}" 
                       stroke="currentColor" stroke-width="2" 
                       stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 20.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
              </button>
          </div>
      </div>
    `
    )
    .join("");
}

// Функция для применения фильтров и сортировки
function applyFiltersAndSort(sortKey, sortOrder) {
  let filteredProducts = applyFilters(); // Применяем фильтры

  const sortedProducts = sortProducts(filteredProducts, sortKey, sortOrder); // Применяем сортировку

  updateProductDisplay(sortedProducts); // Обновляем отображение
}

// Функция для проверки авторизации пользователя
async function checkAuth() {
  // Получаем токен из localStorage
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("Токен отсутствует. Пользователь не авторизован.");
    return false; // Пользователь не авторизован
  }

  try {
    const response = await fetch("../php/check_auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Передаем токен в заголовке
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при проверке авторизации");
    }

    const data = await response.json();

    return data.authenticated; // Возвращаем true, если пользователь авторизован
  } catch (error) {
    console.error("Ошибка при проверке авторизации:", error);
    return false;
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
  const isAuthenticated = await checkAuth(); // Проверяем авторизацию

  if (!isAuthenticated) {
    // Если пользователь не авторизован, показываем сообщение и не загружаем товары
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML =
      "<p>Пожалуйста, войдите в систему, чтобы просмотреть товары.</p>";
    return;
  }

  // Если пользователь авторизован, загружаем товары
  products = await fetchProducts();

  if (!Array.isArray(products)) {
    return;
  }

  // Обработчики для кнопок сортировки
  document
    .querySelector("button[onclick*=\"sortProducts('price', 'asc')\"]")
    .addEventListener("click", () => {
      applyFiltersAndSort("price", "asc");
    });

  document
    .querySelector("button[onclick*=\"sortProducts('price', 'desc')\"]")
    .addEventListener("click", () => {
      applyFiltersAndSort("price", "desc");
    });

  document
    .querySelector("button[onclick*=\"sortProducts('name', 'asc')\"]")
    .addEventListener("click", () => {
      applyFiltersAndSort("name", "asc");
    });

  document
    .querySelector("button[onclick*=\"sortProducts('name', 'desc')\"]")
    .addEventListener("click", () => {
      applyFiltersAndSort("name", "desc");
    });

  // Обработчик для кнопки "Применить фильтры"
  document
    .querySelector('button[onclick="applyFilters()"]')
    .addEventListener("click", () => {
      applyFiltersAndSort("price", "asc"); // Применяем фильтры и сортировку по умолчанию
    });

  // Первоначальное отображение товаров
  updateProductDisplay(products);
});
