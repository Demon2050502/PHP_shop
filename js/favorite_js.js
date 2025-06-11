// Функция для загрузки избранных товаров с сервера
async function fetchFavorites() {
  try {
    const response = await fetch("php/favorite/get_favorites.php");
    const data = await response.json();

    if (data.status === "success") {
      return data.favorites;
    } else {
      console.error("Ошибка при загрузке избранных товаров:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Ошибка при загрузке избранных товаров:", error);
    return [];
  }
}

// Функция для отображения избранных товаров
async function renderFavoriteProducts() {
  const isAuthenticated = await checkAuth();
  const favoriteContainer = document.getElementById("favoriteContainer");

  if (!isAuthenticated) {
    // Если пользователь не авторизован, показываем сообщение
    favoriteContainer.innerHTML = `
      <div class="auth-message">
        <p>Пожалуйста, войдите в систему, чтобы просмотреть избранные товары.</p>
      </div>
    `;
    return;
  }

  const favorites = await fetchFavorites();

  if (!Array.isArray(favorites)) {
    favoriteContainer.innerHTML = "<p>Нет избранных товаров</p>";
    return;
  }

  // Очищаем контейнер перед рендерингом
  favoriteContainer.innerHTML = "";

  // Рендерим карточки последовательно
  for (const item of favorites) {
    const cardHTML = await createFavoriteCard(item);
    favoriteContainer.innerHTML += cardHTML;
  }
}

// Функция для создания карточки избранного товара
function createFavoriteCard(item) {
  const isFavorite = checkFavorite(item.id);

  return `
    <div class="product-card frame" data-product-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <div class="price">${item.price} ₽</div>

        <div class="actions">
              <button class="open-reviews" onclick="openReviewModal(${
                item.id
              }, '${item.name}', '${item.image}')">
                  <img src="img_sait/cart/reviews.svg">
              </button>
            <button class="add-to-cart" onclick="addToCart(${
              item.id
            })">В корзину</button>
            <button class="add-to-favorite ${isFavorite ? "active" : ""}" 
                    onclick="toggleHeart(this, ${item.id})">
              <svg class="heart-icon" viewBox="0 0 24 24" 
                   fill="${isFavorite ? "red" : "none"}" 
                   stroke="currentColor" stroke-width="2">
                <path id="heart-path" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 20.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
        </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderFavoriteProducts();
});
