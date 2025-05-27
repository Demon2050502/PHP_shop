// Функция для проверки авторизации пользователя
async function checkAuth() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("Токен отсутствует. Пользователь не авторизован.");
    return false;
  }

  try {
    const response = await fetch("php/check_auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при проверке авторизации");
    }

    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error("Ошибка при проверке авторизации:", error);
    return false;
  }
}

// Функция для перенаправления неавторизованных пользователей
function redirectUnauthorized() {
  const container = document.querySelector(".cart-container");
  container.innerHTML = `
    <div class="auth-message frame">
      <p>Пожалуйста, войдите в систему, чтобы получить доступ к личному кабинету.</p>
      <a href="login.html" class="login-link">Войти</a>
    </div>
  `;

  // Скрываем модальное окно изменения пароля
  const modal = document.getElementById("passwordModal");
  if (modal) modal.style.display = "none";
}

// Функция для загрузки данных пользователя
async function loadUserData() {
  try {
    console.log("Загрузка данных пользователя...");
    const response = await fetch("php/get_user_data.php");

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMsg =
        errorData?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMsg);
    }

    const userData = await response.json();
    console.log("Получены данные:", userData);

    if (userData.success) {
      document.querySelector("#UserName").textContent = userData.username;
      if (userData.avatar) {
        document.querySelector("#userAvatar").src = userData.avatar;
      }
    } else {
      console.error("Ошибка сервера:", userData.message);
      document.querySelector("#UserName").textContent = "";
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error.message);
    document.querySelector("#UserName").textContent = "Ошибка загрузки";
  }
}

// Функция для изменения пароля
async function changePassword(oldPassword, newPassword) {
  try {
    const response = await fetch("php/change_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return true;
    } else {
      alert(result.message || "Ошибка при изменении пароля");
      return false;
    }
  } catch (error) {
    console.error("Ошибка:", error);
    return false;
  }
}

// Инициализация страницы
document.addEventListener("DOMContentLoaded", async function () {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirectUnauthorized();
    return;
  }

  // Загружаем данные пользователя только если авторизован
  loadUserData();

  // Элементы модального окна
  const modal = document.getElementById("passwordModal");
  const btn = document.getElementById("changePasswordBtn");
  const span = document.querySelector(".close");

  // Открытие модального окна
  if (btn && modal) {
    btn.addEventListener("click", function () {
      modal.style.display = "block";
    });
  }

  // Закрытие модального окна
  if (span) {
    span.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Закрытие при клике вне окна
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Обработка формы
  const passwordForm = document.getElementById("passwordForm");
  if (passwordForm) {
    passwordForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const oldPassword = document.getElementById("oldPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        alert("Новые пароли не совпадают!");
        return;
      }

      if (newPassword.length < 6) {
        alert("Пароль должен содержать минимум 6 символов");
        return;
      }

      const success = await changePassword(oldPassword, newPassword);

      if (success) {
        modal.style.display = "none";
        passwordForm.reset();
      }
    });
  }
});
