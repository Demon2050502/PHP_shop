let currentSlide = 0;
const slides = document.querySelector(".slides");
const dots = document.querySelectorAll(".dot");
const totalSlides = document.querySelectorAll(".slide").length;

function updateSlider() {
  slides.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

// Автоматическая смена слайдов каждые 5 секунд
setInterval(nextSlide, 5000);

// Функция для динамического отображения звезд рейтинга
function setRating(starsContainer, rating) {
  starsContainer.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = `star ${i <= rating ? "filled" : ""}`;
    star.textContent = "★";
    starsContainer.appendChild(star);
  }
}

// Пример использования: установка рейтинга 4 звезды
const ratingContainer = document.querySelector(".rating");
setRating(ratingContainer, 4);

async function fetchRandomProducts() {
  const response = await fetch("../php/get_random_products.php");
  const data = await response.json();
  return data.products || data;
}

async function displayRandomProducts() {
  try {
    const randomProducts = await fetchRandomProducts();

    const container = document.getElementById("randomProductsContainer");
    if (!container) {
      console.error("Контейнер для случайных товаров не найден");
      return;
    }

    // Получаем статусы избранного для выбранных товаров
    const favoriteStatuses = await Promise.all(
      randomProducts.map((product) => checkFavorite(product.id))
    );

    // Генерируем HTML для каждого товара
    container.innerHTML = randomProducts
      .map(
        (product, index) => `
        <div class="product-card" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <div class="price">${product.price} ₽</div>
          <div class="actions">
            <button class="open-reviews" onclick="openReviewModal(${
              product.id
            }, '${product.name}', '${product.image}')">
              <img src="img_sait/reviews.svg">
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
  } catch (error) {
    console.error("Ошибка при отображении случайных товаров:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await displayRandomProducts();
});

async function checkAuth() {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const response = await fetch("../php/check_auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error("Ошибка при проверке авторизации:", error);
    return false;
  }
}
