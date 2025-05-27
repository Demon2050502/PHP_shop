document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("php/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
      });

      const result = await response.json();

      if (result.success) {
        if (result.user_id) {
          localStorage.setItem("authToken", result.user_id);
        }
        window.location.href = result.redirect;
      } else {
        showAlertModal(
          "Ошибка входа",
          result.message || "Произошла ошибка при входе"
        );
      }
    } catch (error) {
      showAlertModal("Ошибка", "Не удалось выполнить запрос: " + error.message);
    }
  });
