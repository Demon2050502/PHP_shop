document.addEventListener("DOMContentLoaded", function () {
  const background = document.querySelector(".sakura-background");
  const petalCount = 25;

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";

    // Случайные параметры
    petal.style.width = `${Math.random() * 15 + 5}px`;
    petal.style.height = petal.style.width;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${Math.random() * 15 + 10}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    petal.style.opacity = Math.random() * 0.5 + 0.3;

    background.appendChild(petal);
  }
});
