document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    mainNav.classList.toggle("active");
  });

  // Закрытие меню при клике вне его области
  document.addEventListener("click", function (e) {
    if (
      mainNav.classList.contains("active") &&
      !e.target.closest("nav") &&
      e.target !== menuToggle
    ) {
      mainNav.classList.remove("active");
    }
  });
});
