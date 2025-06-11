document.getElementById("submitReview").addEventListener("click", async () => {
  const reviewText = document.getElementById("reviewText").value;
  const productId = document
    .getElementById("reviewModal")
    .getAttribute("data-product-id");
  const rating = document.querySelector('input[name="rating"]:checked')?.value;

  const authChecked = await checkAuthWithAlert();
  if (!authChecked) return;

  if (!reviewText) {
    alert("Текст отзыва не может быть пустым");
    return;
  }

  if (!rating) {
    alert("Пожалуйста, выберите рейтинг");
    return;
  }

  const token = localStorage.getItem("authToken");

  const response = await fetch("php/reviews/add_review.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      productId,
      text: reviewText,
      rating,
    }),
  });

  const data = await response.json();
  if (data.status === "success") {
    document.getElementById("reviewText").value = "";
    document
      .querySelectorAll('input[name="rating"]')
      .forEach((el) => (el.checked = false));
    displayReviews(productId);
  } else {
    alert(data.message);
  }
});

async function displayReviews(productId) {
  const response = await fetch(
    `php/reviews/get_reviews.php?productId=${productId}`
  );
  const reviews = await response.json();

  const reviewsList = document.getElementById("reviewsList");
  reviewsList.innerHTML = reviews
    .map(
      (review) => `
        <div class="review">
            <div class="review-header">
                <span class="review-user">${review.user_name || "Аноним"}</span>
                <span class="review-time">${new Date(
                  review.created_at
                ).toLocaleString()}</span>
                <div class="review-rating">${"★".repeat(
                  review.rating
                )}${"☆".repeat(5 - review.rating)}</div>
            </div>
            <h3>Комментариий к товару</h3>
            <div class="review-text">${review.text}</div>
        </div>
    `
    )
    .join("");

  // Прокручиваем к началу списка отзывов
  reviewsList.scrollTop = 0;
}

async function openReviewModal(productId, productTitle, productImage) {
  const modal = document.getElementById("reviewModal");
  modal.setAttribute("data-product-id", productId);
  modal.style.display = "block";

  // Устанавливаем информацию о товаре
  document.getElementById("productTitle").textContent = productTitle;
  document.getElementById("productImage").src = productImage;

  // Загружаем отзывы и средний рейтинг
  await displayReviews(productId);
  await displayAverageRating(productId);

  // Закрытие модального окна
  const span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Новая функция для отображения среднего рейтинга
async function displayAverageRating(productId) {
  const response = await fetch(
    `php/get_average_rating.php?productId=${productId}`
  );
  const data = await response.json();

  if (data.averageRating) {
    const averageRatingStars = document.getElementById("averageRatingStars");
    const averageRatingValue = document.getElementById("averageRatingValue");
    const reviewsCount = document.getElementById("reviewsCount");

    // Округляем до десятых
    const roundedRating = Math.round(data.averageRating * 10) / 10;

    averageRatingStars.innerHTML =
      "★".repeat(Math.round(data.averageRating)) +
      "☆".repeat(5 - Math.round(data.averageRating));
    averageRatingValue.textContent = roundedRating;
    reviewsCount.textContent = `(${data.reviewsCount} отзывов)`;
  }
}

// Обновляем displayReviews чтобы вызывать обновление рейтинга после добавления отзыва
async function displayReviews(productId) {
  const response = await fetch(
    `php/reviews/get_reviews.php?productId=${productId}`
  );
  const reviews = await response.json();

  const reviewsList = document.getElementById("reviewsList");
  reviewsList.innerHTML = reviews
    .map(
      (review) => `
        <div class="review">
            <div class="review-header">
                <span class="review-user">${review.user_name || "Аноним"}</span>
                <span class="review-time">${new Date(
                  review.created_at
                ).toLocaleString()}</span>
                <div class="review-rating">${"★".repeat(
                  review.rating
                )}${"☆".repeat(5 - review.rating)}</div>
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `
    )
    .join("");

  // Обновляем средний рейтинг после загрузки отзывов
  await displayAverageRating(productId);
}
