async function addToCart(productId) {
  const quantity = 1; // Количество товара (можно сделать настраиваемым)
  const userId = localStorage.getItem("authToken");

  if (!userId) {
    alert("Пожалуйста, войдите в систему, чтобы добавить товар в корзину.");
    return;
  }

  const response = await fetch("./php/add_to_cart.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity, userId }),
  });
  const data = await response.json();
  alert(data.message); // Показываем сообщение о результате
}
