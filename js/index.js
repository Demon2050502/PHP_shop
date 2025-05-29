document.addEventListener("DOMContentLoaded", function () {
  class InfiniteSlider {
    constructor(containerSelector) {
      this.sliderContainer = document.querySelector(containerSelector);
      this.sliderTrack = this.sliderContainer.querySelector(".slider");
      this.slides = this.sliderTrack.querySelectorAll(".slide");
      this.prevBtn = this.sliderContainer.querySelector(".prev");
      this.nextBtn = this.sliderContainer.querySelector(".next");
      this.dots = this.sliderContainer.querySelectorAll(".dot");
      this.currentIndex = 0;
      this.isTransitioning = false;
      this.autoPlayInterval = null;
      this.autoPlayDelay = 6000;
      this.slideCount = this.slides.length - 2; // Исключаем клонированные слайды

      this.init();
    }

    init() {
      this.cloneSlides();
      this.setEventListeners();
      this.startAutoPlay();
      this.updateSlider();
      this.updateDots();
    }

    cloneSlides() {
      const firstSlide = this.slides[0].cloneNode(true);
      const lastSlide = this.slides[this.slides.length - 1].cloneNode(true);

      this.sliderTrack.appendChild(firstSlide);
      this.sliderTrack.insertBefore(lastSlide, this.slides[0]);

      this.slides = this.sliderTrack.querySelectorAll(".slide");
      this.currentIndex = 1;
    }

    setEventListeners() {
      this.prevBtn.addEventListener("click", () => this.prevSlide());
      this.nextBtn.addEventListener("click", () => this.nextSlide());

      this.dots.forEach((dot, index) => {
        dot.addEventListener("click", () => this.goToSlide(index));
      });

      this.sliderTrack.addEventListener("transitionend", () => {
        this.isTransitioning = false;
        this.handleSlideEnd();
      });
    }

    goToSlide(index) {
      if (this.isTransitioning) return;
      this.isTransitioning = true;

      // Учитываем, что у нас есть клонированные слайды
      this.currentIndex = index + 1;
      this.updateSlider();
      this.updateDots();
    }

    prevSlide() {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      this.currentIndex--;
      this.updateSlider();
      this.updateDots();
    }

    nextSlide() {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      this.currentIndex++;
      this.updateSlider();
      this.updateDots();
    }

    updateSlider() {
      this.sliderTrack.style.transition = "transform 0.5s ease-in-out";
      this.sliderTrack.style.transform = `translateX(-${
        this.currentIndex * 100
      }%)`;
    }

    updateDots() {
      let dotIndex;
      if (this.currentIndex === 0) {
        dotIndex = this.slideCount - 1;
      } else if (this.currentIndex === this.slides.length - 1) {
        dotIndex = 0;
      } else {
        dotIndex = this.currentIndex - 1;
      }

      this.dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === dotIndex);
      });
    }

    handleSlideEnd() {
      if (this.currentIndex === 0) {
        this.sliderTrack.style.transition = "none";
        this.currentIndex = this.slides.length - 2;
        this.sliderTrack.style.transform = `translateX(-${
          this.currentIndex * 100
        }%)`;
      } else if (this.currentIndex === this.slides.length - 1) {
        this.sliderTrack.style.transition = "none";
        this.currentIndex = 1;
        this.sliderTrack.style.transform = `translateX(-${
          this.currentIndex * 100
        }%)`;
      }

      // Обновляем точки после перехода
      this.updateDots();

      // Принудительный рефлоу для корректной работы анимации
      void this.sliderTrack.offsetWidth;
    }

    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoPlayDelay);
    }

    stopAutoPlay() {
      clearInterval(this.autoPlayInterval);
    }
  }

  // Инициализация слайдера
  const slider = new InfiniteSlider(".slider-container");
});

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
  const response = await fetch("php/get_random_products.php");
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
    const response = await fetch("php/check_auth.php", {
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
