// pagination.js
(function () {
  function createButton(label, ariaLabel, disabled) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.setAttribute('aria-label', ariaLabel);
    if (disabled) btn.disabled = true;
    btn.className = 'pag-btn';
    return btn;
  }

  function paginateList(listEl, pagerEl, itemsPerPage) {
    const items = Array.from(listEl.querySelectorAll('.menu-item'));
    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    let currentPage = 1;

    function showPage(page) {
      currentPage = Math.min(Math.max(1, page), totalPages);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      items.forEach((it, idx) => {
        it.style.display = (idx >= start && idx < end) ? '' : 'none';
      });
      renderPager();
    }

    function renderPager() {
      pagerEl.innerHTML = '';
      // Prev
      const prevBtn = createButton('«', 'Previous page', currentPage === 1);
      prevBtn.addEventListener('click', () => showPage(currentPage - 1));
      pagerEl.appendChild(prevBtn);

      // Page numbers (tampilkan ringkas bila banyak halaman)
      const maxButtons = 7;
      let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let end = Math.min(totalPages, start + maxButtons - 1);
      if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

      for (let p = start; p <= end; p++) {
        const btn = createButton(String(p), `Page ${p}`, false);
        if (p === currentPage) {
          btn.classList.add('active');
          btn.setAttribute('aria-current', 'page');
          btn.disabled = true;
        }
        btn.addEventListener('click', () => showPage(p));
        pagerEl.appendChild(btn);
      }

      // Next
      const nextBtn = createButton('»', 'Next page', currentPage === totalPages);
      nextBtn.addEventListener('click', () => showPage(currentPage + 1));
      pagerEl.appendChild(nextBtn);
    }

    // init
    if (items.length === 0) {
      pagerEl.innerHTML = ''; // nothing to paginate
      return;
    }
    showPage(1);
  }

  function initAll() {
    const lists = document.querySelectorAll('.menu-list');
    lists.forEach(listEl => {
      const itemsPerPage = parseInt(listEl.getAttribute('data-items-per-page'), 10) || 6;

      // Cari pager di dalam parent, atau by-id convention
      let pagerEl = listEl.parentElement.querySelector('.pagination-container');
      if (!pagerEl) {
        const id = listEl.id || '';
        pagerEl = id ? document.querySelector(`#pagination-${id}`) : null;
      }

      // Jika belum ada pager, buat dan sisipkan setelah list
      if (!pagerEl) {
        pagerEl = document.createElement('nav');
        pagerEl.className = 'pagination-container';
        pagerEl.setAttribute('aria-label', `Pagination for ${listEl.id || 'menu'}`);
        listEl.parentElement.appendChild(pagerEl);
      }

      paginateList(listEl, pagerEl, itemsPerPage);
    });
  }

  document.addEventListener('DOMContentLoaded', initAll);
})();
