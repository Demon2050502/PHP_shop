document.getElementById("submitReview").addEventListener("click", async () => {
  const userName = document.getElementById("userName").value;
  const reviewText = document.getElementById("reviewText").value;
  const productId = document
    .getElementById("reviewModal")
    .getAttribute("data-product-id"); // Получаем productId из модального окна

  if (!reviewText) {
    alert("Текст отзыва не может быть пустым");
    return;
  }

  const response = await fetch("./php/add_review.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      userName,
      text: reviewText,
    }),
  });

  const data = await response.json();
  if (data.status === "success") {
    alert(data.message);
    document.getElementById("userName").value = "";
    document.getElementById("reviewText").value = "";
    displayReviews(productId); // Обновляем список отзывов
  } else {
    alert(data.message);
  }
});

async function displayReviews(productId) {
  const response = await fetch(`./php/get_reviews.php?productId=${productId}`);
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
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `
    )
    .join("");
}

function openReviewModal(productId) {
  const modal = document.getElementById("reviewModal");
  modal.setAttribute("data-product-id", productId);
  modal.style.display = "block";

  // Загружаем отзывы для выбранного товара
  displayReviews(productId);

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
