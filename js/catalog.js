const DEFAULT_CARD_WIDTH = 200;
const DEFAULT_CARD_HEIGHT = 410;
const DEFAULT_CARD_GAP = 20;

let products = []; // Все товары
let filteredProducts = []; // Отфильтрованные товары
let currentPage = 1;
let productsPerPage = 6;
let currentSortKey = "price";
let currentSortOrder = "asc";
let resizeTimer;

// Загрузка товаров
async function fetchProducts() {
  const response = await fetch("php/get_products.php");
  const data = await response.json();
  return data.products || data;
}

// Сортировка товаров
function sortProducts(products, key, order = "asc") {
  if (!Array.isArray(products)) return [];

  return [...products].sort((a, b) => {
    if (key === "price") {
      const valueA = parseFloat(a.price);
      const valueB = parseFloat(b.price);
      return order === "asc" ? valueA - valueB : valueB - valueA;
    } else if (key === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name, "ru", { sensitivity: "base" })
        : b.name.localeCompare(a.name, "ru", { sensitivity: "base" });
    }
    return 0;
  });
}

// Применение фильтров
function applyFilters() {
  const selectedCategories = Array.from(
    document.querySelectorAll('.category-filter input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.value);

  filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    return matchesCategory;
  });

  return filteredProducts;
}

// Обновление отображения товаров
async function updateProductDisplay() {
  const previousProductsPerPage = productsPerPage;

  try {
    productsPerPage = calculateProductsPerPage();
  } catch (e) {
    console.error("Ошибка расчёта товаров на странице:", e);
    productsPerPage = previousProductsPerPage || 6;
  }

  const productContainer = document.getElementById("productContainer");

  // Сортируем текущие отфильтрованные товары
  const sortedProducts = sortProducts(
    filteredProducts,
    currentSortKey,
    currentSortOrder
  );

  // Рассчитываем пагинацию
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / productsPerPage)
  );
  currentPage = Math.min(currentPage, totalPages);

  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // console.log(productsPerPage);

  // Получаем статусы избранного
  const favoriteStatuses = await Promise.all(
    paginatedProducts.map((product) => checkFavorite(product.id))
  );

  // Рендерим товары
  productContainer.innerHTML = paginatedProducts
    .map(
      (product, index) => `
    <div class="product-card" data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <div class="price">${product.price} ₽</div>
      <div class="actions">
        <button class="open-reviews" onclick="openReviewModal(${product.id}, '${
        product.name
      }', '${product.image}')">
          <img src="img_sait/cart/reviews.svg">
        </button>
        <button class="add-to-cart" onclick="addToCart(${
          product.id
        })">В корзину</button>
        <button class="add-to-favorite ${
          favoriteStatuses[index] ? "active" : ""
        }" 
                onclick="toggleHeart(this, ${product.id})">
          <svg class="heart-icon" viewBox="0 0 24 24" 
               fill="${favoriteStatuses[index] ? "red" : "none"}" 
               stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 20.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
  `
    )
    .join("");

  updatePagination(totalPages);
}

// Обновление пагинации
function updatePagination(totalPages) {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  // Кнопка "Назад"
  const prevButton = document.createElement("button");
  prevButton.innerHTML = "&laquo;";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateProductDisplay();
    }
  });
  paginationContainer.appendChild(prevButton);

  // Номера страниц
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Корректируем диапазон, если он слишком мал
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = currentPage === i ? "active" : "";
    pageButton.addEventListener("click", () => {
      currentPage = i;
      updateProductDisplay();
    });
    paginationContainer.appendChild(pageButton);
  }

  // Кнопка "Вперед"
  const nextButton = document.createElement("button");
  nextButton.innerHTML = "&raquo;";
  nextButton.disabled = currentPage === totalPages || totalPages === 0;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateProductDisplay();
    }
  });
  paginationContainer.appendChild(nextButton);
}

// Применение фильтров и сортировки
function applyFiltersAndSort(sortKey, sortOrder) {
  currentSortKey = sortKey;
  currentSortOrder = sortOrder;

  applyFilters();

  updateProductDisplay();
}

// Инициализация
document.addEventListener("DOMContentLoaded", async () => {
  products = await fetchProducts();
  if (Array.isArray(products)) {
    filteredProducts = [...products];

    updateProductDisplay();

    document.querySelectorAll(".filters button").forEach((button) => {
      const match = button.onclick
        ?.toString()
        .match(/sortProducts\('(\w+)',\s*'(\w+)'\)/);
      if (match) {
        button.addEventListener("click", () =>
          applyFiltersAndSort(match[1], match[2])
        );
      }
    });

    document
      .querySelector('button[onclick="applyFilters()"]')
      .addEventListener("click", () =>
        applyFiltersAndSort(currentSortKey, currentSortOrder)
      );
  }
});

function calculateProductsPerPage() {
  const cardWidth = DEFAULT_CARD_WIDTH + DEFAULT_CARD_GAP * 2;
  const cardHeight = DEFAULT_CARD_HEIGHT + DEFAULT_CARD_GAP * 2;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const cardsPerRow = Math.max(1, Math.floor(windowWidth / cardWidth));
  const cardsPerColumn = Math.max(1, Math.floor(windowHeight / cardHeight));

  return cardsPerRow * cardsPerColumn;
}

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const newValue = calculateProductsPerPage();
    if (newValue !== productsPerPage) {
      productsPerPage = newValue;
      updateProductDisplay();
    }
  }, 200);
});
