document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/php/login.php", {
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

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Получаем элементы по ID
      const usernameInput = document.getElementById("username");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      // Проверяем, что элементы существуют
      if (!usernameInput || !emailInput || !passwordInput) {
        console.error("Один из элементов формы не найден");
        return;
      }

      const username = usernameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        const response = await fetch("php/register.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `username=${encodeURIComponent(
            username
          )}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(
            password
          )}`,
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem("authToken", result.user_id);
          window.location.href = "../review.html";
        } else {
          alert(result.message || "Ошибка регистрации");
        }
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка сети: " + error.message);
      }
    });
  } else {
    console.error("Форма регистрации не найдена");
  }
});

// Проверка ошибок в URL (для не-AJAX запросов)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("error")) {
  showAlertModal("Ошибка входа", urlParams.get("error"));
}
