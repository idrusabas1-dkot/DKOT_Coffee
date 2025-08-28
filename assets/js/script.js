
// Basic interactive JS for nav & small image fallback handling
document.addEventListener('DOMContentLoaded', function () {
  // Footer year
  const year = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = year;

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      navList.classList.toggle('open');
    });
  }
});

/**
 * handleImageError tries to load fallback paths when an <img> fails to load.
 * This helps if images are stored at absolute local paths (like D:\WEB DKOT\...)
 * while testing locally. For hosted sites use relative paths (assets/...).
 *
 * imageKey: one of 'logo','whatapps','shopee','grab_food','go_food','iced_americano', etc.
 */
function handleImageError(imgEl, imageKey) {
  if (!imgEl || imgEl.dataset.retired) return;

  // Attempt file:/// absolute fallback (useful only for local testing)
  const fallbacks = {
    logo: [
      'file:///D:/WEB%20DKOT/logo/logo.png',
      'file:///D:/WEB%20DKOT/logo/logo.jpg'
    ],
    whatapps: ['file:///D:/WEB%20DKOT/logo/whatapps.png'],
    shopee: ['file:///D:/WEB%20DKOT/logo/shopee.png'],
    grab_food: ['file:///D:/WEB%20DKOT/logo/grab_food.png'],
    go_food: ['file:///D:/WEB%20DKOT/logo/go_food.png'],
    iced_americano: ['file:///D:/WEB%20DKOT/Menu/iced_americano.png'],
    iced_gula_aren: ['file:///D:/WEB%20DKOT/Menu/iced_gula_aren.png'],
    hot_americano: ['file:///D:/WEB%20DKOT/Menu/hot_americano.png'],
    hot_coffe_latte: ['file:///D:/WEB%20DKOT/Menu/hot_coffe_latte.png'],
    instagram: ['file:///D:/WEB%20DKOT/logo/instagram.png']
  };

  const tries = fallbacks[imageKey] || [];
  let i = 0;

  function tryNext() {
    if (i >= tries.length) {
      // stop trying and mark as retired to avoid infinite loops
      imgEl.dataset.retired = "1";
      return;
    }
    imgEl.src = tries[i++];
  }

  // try first fallback
  tryNext();

  // if it still fails, the onerror will call handleImageError again but dataset.retired will prevent loop
}
