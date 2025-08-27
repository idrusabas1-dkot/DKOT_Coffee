document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = lightbox && lightbox.querySelector('.lightbox-close');

  // Pilih semua gambar di menu (sesuaikan selector jika perlu)
  document.querySelectorAll('.menu-item img').forEach(img => {
    // buat dapat difokus/diakses keyboard
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', img.alt || 'Lihat gambar');

    img.addEventListener('click', () => openLightbox(img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  function openLightbox(imgEl) {
    const src = imgEl.currentSrc || imgEl.src;
    const alt = imgEl.alt || '';

    // jika browser mendukung dialog
    if (lightbox && typeof lightbox.showModal === 'function') {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightboxCaption.textContent = alt;
      lightbox.showModal();
      // fokus ke tombol close untuk akses keyboard
      closeBtn && closeBtn.focus();
    } else {
      // fallback overlay
      createFallbackOverlay(src, alt);
    }
  }

  // event close for dialog
  if (closeBtn) {
    closeBtn.addEventListener('click', () => lightbox.close());
  }

  // klik di backdrop (dialog) untuk tutup
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.close();
    });
    // escape untuk tutup
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.open) lightbox.close();
    });
  }

  function createFallbackOverlay(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-fallback';
    overlay.innerHTML = `
      <div class="lightbox-fallback-inner" role="dialog" aria-modal="true">
        <button class="lightbox-close-fb" aria-label="Tutup">&times;</button>
        <img src="${src}" alt="${escapeHtml(alt)}">
        <div class="lightbox-caption-fb">${escapeHtml(alt)}</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const closeFb = overlay.querySelector('.lightbox-close-fb');
    closeFb.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    function onEsc(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', onEsc);
      }
    }
    document.addEventListener('keydown', onEsc);
  }

  // very small helper to avoid XSS when injecting alt text
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
});
