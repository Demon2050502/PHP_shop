async function fetchCart() {
  const response = await fetch("php/cart/get_cart.php");
  const data = await response.json();
  return data;
}

function renderCart(cart) {
  const cartContainer = document.getElementById("cart-items-container");
  cartContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item frame">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <div class="cart-item-price">
                    <span>${item.price} ₽</span>
                </div>
            </div>
            <div class="cart-actions">
                <button class="decrease-quantity" onclick="decreaseQuantity(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" onclick="increaseQuantity(${item.id})">+</button>
            </div>
        </div>
    `
    )
    .join("");

  updateCartSummary(cart); // Обновляем общую стоимость
}

async function removeFromCart(cartId) {
  const response = await fetch(`php/cart/remove_from_cart.php?id=${cartId}`);
  const data = await response.json();
  alert(data.message);
  const cart = await fetchCart();
  renderCart(cart);
}

async function increaseQuantity(cartId) {
  const response = await fetch(
    `php/cart/increase_quantity.php?id=${cartId}`
  );
  const data = await response.json();
  if (data.status === "success") {
    const cart = await fetchCart();
    renderCart(cart);
    updateCartSummary(cart); // Обновляем общую стоимость
  } else {
    alert(data.message);
  }
}

async function decreaseQuantity(cartId) {
  const response = await fetch(
    `php/cart/decrease_quantity.php?id=${cartId}`
  );
  const data = await response.json();
  if (data.status === "success") {
    const cart = await fetchCart();
    renderCart(cart);
    updateCartSummary(cart); // Обновляем общую стоимость
  } else {
    alert(data.message);
  }
}

function updateCartSummary(cart) {
  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalQuantity += parseInt(item.quantity);
    totalPrice += item.price * item.quantity;
  });

  // Обновляем количество товаров
  document.getElementById("col").textContent = `${totalQuantity} товаров`;

  // Обновляем общую стоимость
  document.getElementById("price_ALL").textContent = `${totalPrice.toFixed(
    2
  )} ₽`;
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
    const response = await fetch("php/check_auth.php", {
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
    // Если пользователь не авторизован, показываем сообщение
    const cartContainer = document.getElementById("cart-items-container");
    cartContainer.innerHTML = `
      <div class="auth-message">
        <p>Пожалуйста, войдите в систему, чтобы использовать корзину.</p>
      </div>
    `;

    // Скрываем блок с итоговой стоимостью
    document.querySelector(".cart-summary").style.display = "none";
    return;
  }

  // Если пользователь авторизован, загружаем корзину
  const cart = await fetchCart();
  renderCart(cart);
});
