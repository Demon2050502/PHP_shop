let currentSlide = 0;
const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
const totalSlides = document.querySelectorAll('.slide').length;

function updateSlider() {
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// Автоматическая смена слайдов каждые 5 секунд
setInterval(nextSlide, 5000);

// Функция для динамического отображения звезд рейтинга
function setRating(starsContainer, rating) {
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = `star ${i <= rating ? 'filled' : ''}`;
        star.textContent = '★';
        starsContainer.appendChild(star);
    }
}

// Пример использования: установка рейтинга 4 звезды
const ratingContainer = document.querySelector('.rating');
setRating(ratingContainer, 4);