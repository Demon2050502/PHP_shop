async function loadAuthData_main() {
  try {
    const response = await fetch("./php/check_auth.php");
    const data = await response.json();

    const authButtons = document.getElementById("authButtons");

    if (data.authenticated) {
      // Если пользователь авторизован
      let adminLink = "";
      if (data.is_admin) {
        adminLink =
          '<a href="admin.php" class="admin-link">Админ-панель</a>';
      }

      authButtons.innerHTML = `
        <span>${data.username}</span>
        ${adminLink}
        <a href="php/logout.php">Выйти</a>
      `;
    } else {
      // Если пользователь не авторизован
      authButtons.innerHTML = `
        <a href="login.html">Вход / Регистрация</a>
      `;
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
}

// Загружаем данные при загрузке страницы
window.onload = loadAuthData_main;
