async function addToCart(productId) {
  const quantity = 1;
  const authChecked = await checkAuthWithAlert();
  if (!authChecked) return;

  const token = localStorage.getItem("authToken");

  const response = await fetch("php/add_to_cart.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity, token }),
  });
  const data = await response.json();
  alert(data.message);
}
