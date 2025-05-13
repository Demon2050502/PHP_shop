function showAlertModal(
  title,
  message,
  buttonText = "Хорошо",
  autoCloseDelay = 3000
) {
  const modal = document.createElement("div");
  modal.className = "alert-modal";

  // Создаем контент
  modal.innerHTML = `
    <div class="alert-modal__content">
      <h3 class="alert-modal__title">${title}</h3>
      <p class="alert-modal__text">${message}</p>
      <button class="alert-modal__button">${buttonText}</button>
    </div>
  `;

  document.body.appendChild(modal);

  setTimeout(() => modal.classList.add("active"), 10);

  // Функция скрытия
  const hideModal = () => {
    modal.classList.remove("active");
    modal.classList.add("hiding");

    setTimeout(() => {
      document.body.removeChild(modal);
    }, 500);
  };

  modal
    .querySelector(".alert-modal__button")
    .addEventListener("click", hideModal);

  if (autoCloseDelay > 0) {
    setTimeout(hideModal, autoCloseDelay);
  }

  return;
}

async function checkAuthWithAlert() {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    showAlertModal(
      "Требуется авторизация",
      "Пожалуйста, войдите в систему, чтобы просмотреть товары."
    );
    return false;
  }
  return true;
}
