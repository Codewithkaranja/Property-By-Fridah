document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       MOBILE MENU TOGGLE (FIXED)
    ========================== */
    const mobileMenuBtn = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('overlay');

    function closeMenu() {
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }

    mobileMenuBtn?.addEventListener('click', e => {
        e.stopPropagation(); // 🔑 CRITICAL
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    overlay?.addEventListener('click', closeMenu);

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* =========================
       FOOTER YEAR
    ========================== */
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* =========================
       PROPERTY FILTERING (FIXED)
    ========================== */
    const properties = [...document.querySelectorAll('.property-card')];

    const locationFilter = document.getElementById('location');
    const typeFilter = document.getElementById('property-type');
    const priceFilter = document.getElementById('price-range');
    const bedroomsFilter = document.getElementById('bedrooms');
    const statusFilter = document.getElementById('status');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const resetFiltersBtn2 = document.getElementById('resetFilters2');
    const noResults = document.getElementById('noResults');

    function applyFilters() {
        let visibleCount = 0;

        properties.forEach(card => {
            let show = true;
            const { location, type, price, bedrooms, status } = card.dataset;

            if (locationFilter.value !== 'all' && location !== locationFilter.value) show = false;
            if (typeFilter.value !== 'all' && type !== typeFilter.value) show = false;

            if (priceFilter.value !== 'all') {
                const priceNum = parseFloat(price.replace('m', ''));
                if (
                    (priceFilter.value === 'under-5m' && priceNum >= 5) ||
                    (priceFilter.value === '5m-10m' && (priceNum < 5 || priceNum > 10)) ||
                    (priceFilter.value === '10m-20m' && (priceNum < 10 || priceNum > 20)) ||
                    (priceFilter.value === 'over-20m' && priceNum <= 20)
                ) show = false;
            }

            if (bedroomsFilter.value !== 'all') {
                if (bedroomsFilter.value === '4+' && parseInt(bedrooms) < 4) show = false;
                if (bedroomsFilter.value !== '4+' && bedrooms !== bedroomsFilter.value) show = false;
            }

            if (statusFilter.value !== 'all' && status !== statusFilter.value) show = false;

            card.classList.toggle('filtered-out', !show);
            if (show) visibleCount++;
        });

        noResults && (noResults.style.display = visibleCount ? 'none' : 'block');

        currentPage = 1;
        renderPage(currentPage);
    }

    function resetFilters() {
        locationFilter.value = 'all';
        typeFilter.value = 'all';
        priceFilter.value = 'all';
        bedroomsFilter.value = 'all';
        statusFilter.value = 'all';

        properties.forEach(card => card.classList.remove('filtered-out'));
        noResults && (noResults.style.display = 'none');

        currentPage = 1;
        renderPage(currentPage);
    }

    applyFiltersBtn?.addEventListener('click', applyFilters);
    resetFiltersBtn?.addEventListener('click', resetFilters);
    resetFiltersBtn2?.addEventListener('click', resetFilters);

    /* =========================
       PAGINATION (ROOT BUG FIXED)
    ========================== */
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;

    function getFilteredItems() {
        return properties.filter(card => !card.classList.contains('filtered-out'));
    }

    function renderPage(page = 1) {
        const items = getFilteredItems();
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

        currentPage = Math.min(Math.max(1, page), totalPages || 1);

        // Hide ALL first
        properties.forEach(card => card.style.display = 'none');

        // Show only current page
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        items.slice(start, end).forEach(card => {
            card.style.display = 'block';
        });

        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';

        if (currentPage > 1) {
            html += `<button data-page="${currentPage - 1}">Prev</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            html += `
                <button class="${i === currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        if (currentPage < totalPages) {
            html += `<button data-page="${currentPage + 1}">Next</button>`;
        }

        pagination.innerHTML = html;
    }

    document.addEventListener('click', e => {
        const btn = e.target.closest('#pagination button');
        if (!btn) return;
        renderPage(Number(btn.dataset.page));
    });

    /* =========================
       PROPERTY MODAL (UNCHANGED)
    ========================== */
    const modal = document.getElementById('propertyModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');

    document.addEventListener('click', e => {
        const btn = e.target.closest('.view-details-btn');
        if (!btn) return;

        const card = btn.closest('.property-card');
        if (!card) return;

        const title = card.querySelector('.property-title')?.textContent;
        const price = card.querySelector('.property-price')?.textContent;
        const location = card.querySelector('.property-location')?.innerText;
        const status = card.querySelector('.property-badge')?.textContent || 'AVAILABLE';
       // Get images from data-images attribute
const images = JSON.parse(card.dataset.images || '[]');
const mainImage = images[0] || card.querySelector('.property-img img')?.src;

// Build thumbnails HTML
const thumbnailsHtml = images
  .map(src => `<img src="${src}" alt="${title}" class="thumbnail">`)
  .join('');

modalBody.innerHTML = `
  <div class="modal-header">
      <h2>${title}</h2>
      <span class="modal-status status-${status.toLowerCase()}">${status}</span>
  </div>

  <div class="modal-gallery">
      <img src="${mainImage}" alt="${title}" class="main-image">
      <div class="thumbnails">
          ${thumbnailsHtml}
      </div>
  </div>

  <div class="modal-info">
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Price:</strong> ${price}</p>
      <h3>Key Features</h3>
      <ul class="modal-features">
          ${[...card.querySelectorAll('.feature span')].map(f => `<li>${f.textContent}</li>`).join('')}
      </ul>
  </div>

  <div class="modal-actions">
      <a href="https://wa.me/254721911181?text=Hi,%20I'm%20interested%20in%20the%20${title}%20at%20${location}%20Price:%20${price}" 
         target="_blank" class="btn btn-whatsapp">
         <i class="fab fa-whatsapp"></i> WhatsApp
      </a>
      <a href="contact.html" class="btn btn-secondary">Book Site Visit</a>
  </div>
 `;
const mainImageEl = modalBody.querySelector('.main-image');
modalBody.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
        mainImageEl.src = thumb.src;
    });
 });


        modal.classList.add('active');
 document.body.style.overflow = 'hidden';

    });

    modalClose?.addEventListener('click', () => {
        modal.classList.remove('active');
 document.body.style.overflow = 'auto';

    });

    /* =========================
       INIT
    ========================== */
    renderPage(1);
});
