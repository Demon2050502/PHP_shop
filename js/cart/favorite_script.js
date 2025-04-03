// Функция переключения состояния "избранного"
async function toggleHeart(icon, itemId) {
  const userId = localStorage.getItem("authToken");
  if (!userId) {
    alert("Войдите в систему, чтобы добавлять товары в избранное");
    return;
  }

  // Находим SVG внутри кнопки (изменили поиск элемента)
  const heartIcon = icon.querySelector(".heart-icon");
  if (!heartIcon) {
    console.error("Элемент сердца не найден");
    return;
  }

  // Определяем текущее состояние (по наличию класса active)
  const isCurrentlyFavorite = icon.classList.contains("active");
  const newFavoriteState = !isCurrentlyFavorite;

  try {
    const response = await fetch("./php/toggle_favorite.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productId: itemId,
        isFavorite: newFavoriteState,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Произошла ошибка на сервере");
    }

    // Обновляем UI в зависимости от ответа сервера
    if (data.success) {
      icon.classList.toggle("active");
      heartIcon.setAttribute("fill", newFavoriteState ? "red" : "none");
    } else {
      throw new Error(data.message || "Не удалось изменить статус избранного");
    }
  } catch (error) {
    console.error("Ошибка:", error);
    alert(error.message);
  }
}

// Функция проверки, находится ли товар в избранном
async function checkFavorite(productId) {
  const userId = localStorage.getItem("authToken");
  if (!userId) return false;

  try {
    const response = await fetch(
      `./php/check_favorite.php?user_id=${userId}&product_id=${productId}`
    );

    if (!response.ok) {
      console.error("Ошибка при проверке избранного");
      return false;
    }

    const data = await response.json(); // Получаем данные один раз

    console.log(data);

    return data; // Возвращаем результат
  } catch (error) {
    console.error("Ошибка сети:", error);
    return false;
  }
}
