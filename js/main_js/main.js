const token = localStorage.getItem("authToken");

async function loadAuthData_main() {
  try {
    const response = await fetch("php/check_auth.php");
    const data = await response.json();

    const authButtons = document.getElementById("authButtons");

    if (data.authenticated) {
      // Если пользователь авторизован
      let adminLink = "";
      if (data.is_admin) {
        adminLink = '<a href="admin.php" class="admin-link">Админ-панель</a>';
      }

      authButtons.innerHTML = `
        ${adminLink}
        <span>${data.username}</span>
        <a href="php/logout.php">Выйти</a>
      `;
    } else {
      // Если пользователь не авторизован
      authButtons.innerHTML = `
        <a href="login.html" class="auth-button login-btn">Войти</a>
        <a href="register.html" class="auth-button register-btn">Регистрация</a>
      `;
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
}

async function checkAuth() {
  if (!token) return false;

  try {
    const response = await fetch("php/check_auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error("Ошибка при проверке авторизации:", error);
    return false;
  }
}

// Загружаем данные при загрузке страницы
window.onload = loadAuthData_main;
