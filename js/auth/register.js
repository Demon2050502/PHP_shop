document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Получаем элементы по ID
      const usernameInput = document.getElementById("username");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

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

        console.log(result, username, email, password);

        if (result.success) {
          localStorage.setItem("authToken", result.user_id);
          window.location.href = "review.html";
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
