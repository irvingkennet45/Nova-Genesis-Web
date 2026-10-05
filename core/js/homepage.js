/* ==========================================================================
   Nova Genesis - Homepage Specific JavaScript
   Handles hero 3D coverflow carousel and homepage interactive motion
   ========================================================================== */

function initHomepageCarousel() {
  const carousel = document.getElementById('photo-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.slide'));
  if (!slides.length) return;

  const defaultIndex = slides.findIndex((slide) => {
    const alt = slide.querySelector('img')?.getAttribute('alt') || '';
    return alt.toLowerCase().includes('vision');
  });

  let activeIndex = defaultIndex >= 0 ? defaultIndex : 0;

  const positionSlides = () => {
    slides.forEach((slide, index) => {
      const offset = (index - activeIndex + slides.length) % slides.length;
      let left = 50;
      let top = 50;
      let width = 32;
      let height = 70;
      let opacity = 0;
      let scale = 0.72;
      let zIndex = 1;

      if (offset === 0) {
        left = 50;
        top = 50;
        width = 44;
        height = 85;
        opacity = 1;
        scale = 1;
        zIndex = 5;
      } else if (offset === 1) {
        left = 74;
        top = 52;
        width = 26;
        height = 68;
        opacity = 0.9;
        scale = 0.9;
        zIndex = 4;
      } else if (offset === 2) {
        left = 90;
        top = 54;
        width = 18;
        height = 52;
        opacity = 0.65;
        scale = 0.72;
        zIndex = 2;
      } else if (offset === 3) {
        left = 26;
        top = 52;
        width = 26;
        height = 68;
        opacity = 0.9;
        scale = 0.9;
        zIndex = 4;
      } else if (offset === 4) {
        left = 10;
        top = 54;
        width = 18;
        height = 52;
        opacity = 0.65;
        scale = 0.72;
        zIndex = 2;
      }

      slide.style.left = `${left}%`;
      slide.style.top = `${top}%`;
      slide.style.width = `${width}%`;
      slide.style.height = `${height}%`;
      slide.style.opacity = opacity;
      slide.style.zIndex = String(zIndex);
      slide.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });
  };

  positionSlides();

  carousel.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % slides.length;
    positionSlides();
  });
}

function initHomepage() {
  initHomepageCarousel();

  if (typeof window.bindInteractiveMotion === 'function') {
    window.bindInteractiveMotion('.social-card');
  }
}

document.addEventListener('DOMContentLoaded', initHomepage);
