document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       MOBILE MENU TOGGLE
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
        e.stopPropagation();
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    overlay?.addEventListener('click', closeMenu);
    navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    /* =========================
       FOOTER YEAR
    ========================== */
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* =========================
       PROPERTIES DATA (BACKEND READY)
       Fetch from API and generate HTML dynamically
    ========================== */
    const container = document.getElementById('propertiesContainer'); // Parent element where property-cards will be inserted
    let properties = []; // Will hold property objects with element references

    async function loadProperties() {
        try {
            const res = await fetch('/api/properties');
            const data = await res.json();

            container.innerHTML = ''; // Clear existing HTML

            properties = data.map(p => {
    // Convert price to numeric value
    let priceNum = 0;
    if (typeof p.price === 'string') {
        // Remove commas, lowercase, handle "m"
        const priceStr = p.price.replace(/,/g, '').toLowerCase();
        if (priceStr.includes('m')) priceNum = parseFloat(priceStr) || 0;
        else priceNum = parseFloat(priceStr) / 1_000_000; // assume value is in K, convert to millions
    } else {
        priceNum = p.price / 1_000_000; // Convert number to millions
    }

    // Convert size (e.g., "1/8") to decimal acres
    let sizeNum = null;
    if (p.size) {
        const frac = p.size.match(/(\d+)\/(\d+)/);
        if (frac) sizeNum = parseInt(frac[1]) / parseInt(frac[2]);
        else {
            const num = p.size.match(/[\d.]+/);
            if (num) sizeNum = parseFloat(num[0]);
        }
    }

    // Create card element
    const card = document.createElement('div');
    card.className = 'property-card';
    card.dataset.location = p.location;
    card.dataset.type = p.type;
    card.dataset.price = priceNum;
    card.dataset.bedrooms = p.bedrooms || '';
    card.dataset.status = p.status;
    card.dataset.images = JSON.stringify(p.images || []);
    card.dataset.size = sizeNum || '';

    card.innerHTML = `
        <div class="property-img">
            <img src="${p.images[0] || ''}" alt="${p.title}">
            <div class="property-badge badge-new">${p.status === 'available' ? 'NEW' : p.status.toUpperCase()}</div>
        </div>
        <div class="property-details">
            <div class="property-price">KES ${p.price.toLocaleString()}</div>
            <h3 class="property-title">${p.title}</h3>
            <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${p.location}</div>
            <div class="property-features">
                <div class="feature"><i class="fas fa-bed"></i> <span>${p.bedrooms || 0} Beds</span></div>
                <div class="feature"><i class="fas fa-bath"></i> <span>${p.bathrooms || 0} Baths</span></div>
                <div class="feature"><i class="fas fa-car"></i> <span>${p.parking || 0} Parking</span></div>
                <div class="feature"><i class="fas fa-vector-square"></i> <span>${p.size || ''}</span></div>
            </div>
           <div class="property-ctas">
    <a 
        href="https://wa.me/${p.whatsapp || '254721911181'}?text=${encodeURIComponent(`Hi, I'm interested in the ${p.title} at ${p.location} Price: KES ${p.price}`)}" 
        class="btn btn-whatsapp" 
        target="_blank"
    >
        <i class="fab fa-whatsapp"></i> WhatsApp
    </a>
    <button class="btn btn-outline view-details-btn">View Details</button>
</div>

        </div>
    `;

    container.appendChild(card);

    return {
        element: card,
        title: p.title,
        price: `KES ${p.price.toLocaleString()}`,
        priceNum: priceNum,  // now ready for filter comparisons
        location: p.location,
        type: p.type,
        bedrooms: p.bedrooms || 0,
        status: p.status,
        sizeNum: sizeNum,     // optional, in decimal
        images: p.images || [],
        features: [
            `${p.bedrooms || 0} Beds`,
            `${p.bathrooms || 0} Baths`,
            `${p.parking || 0} Parking`,
            `${p.size || ''}`
        ],
        visible: true
    };
});


            applyFilters(); // Initial render
        } catch (err) {
            console.error('Error fetching properties:', err);
        }
    }

    /* =========================
       FILTERS, PAGINATION, MODAL
       SAME AS YOUR WORKING CODE
    ========================== */
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
        properties.forEach(prop => {
            let show = true;
            if (locationFilter.value !== 'all' && prop.location !== locationFilter.value) show = false;
            if (typeFilter.value !== 'all' && prop.type !== typeFilter.value) show = false;
            if (priceFilter.value !== 'all') {
                if (
                    (priceFilter.value === 'under-5m' && prop.priceNum >= 5) ||
                    (priceFilter.value === '5m-10m' && (prop.priceNum < 5 || prop.priceNum > 10)) ||
                    (priceFilter.value === '10m-20m' && (prop.priceNum < 10 || prop.priceNum > 20)) ||
                    (priceFilter.value === 'over-20m' && prop.priceNum <= 20)
                ) show = false;
            }
            if (bedroomsFilter.value !== 'all') {
                if (bedroomsFilter.value === '4+' && prop.bedrooms < 4) show = false;
                if (bedroomsFilter.value !== '4+' && prop.bedrooms.toString() !== bedroomsFilter.value) show = false;
            }
            if (statusFilter.value !== 'all' && prop.status !== statusFilter.value) show = false;

            prop.visible = show;
            prop.element.classList.toggle('filtered-out', !show);
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

        properties.forEach(prop => {
            prop.visible = true;
            prop.element.classList.remove('filtered-out');
        });

        noResults && (noResults.style.display = 'none');

        currentPage = 1;
        renderPage(currentPage);
    }

    applyFiltersBtn?.addEventListener('click', applyFilters);
    resetFiltersBtn?.addEventListener('click', resetFilters);
    resetFiltersBtn2?.addEventListener('click', resetFilters);

    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;

    function getFilteredItems() { return properties.filter(p => p.visible); }

    function renderPage(page = 1) {
        const items = getFilteredItems();
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

        currentPage = Math.min(Math.max(1, page), totalPages || 1);
        properties.forEach(prop => prop.element.style.display = 'none');
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        items.slice(start, end).forEach(prop => prop.element.style.display = 'block');
        renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }

        let html = '';
        if (currentPage > 1) html += `<button data-page="${currentPage - 1}">Prev</button>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        if (currentPage < totalPages) html += `<button data-page="${currentPage + 1}">Next</button>`;
        pagination.innerHTML = html;
    }

    document.addEventListener('click', e => {
        const btn = e.target.closest('#pagination button');
        if (!btn) return;
        renderPage(Number(btn.dataset.page));
    });

    /* =========================
       PROPERTY MODAL
    ========================== */
    const modal = document.getElementById('propertyModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');

    document.addEventListener('click', e => {
        const btn = e.target.closest('.view-details-btn');
        if (!btn) return;

        const card = btn.closest('.property-card');
        if (!card) return;

        const prop = properties.find(p => p.element === card);
        if (!prop) return;

        const mainImage = prop.images[0] || card.querySelector('.property-img img')?.src;
        const thumbnailsHtml = prop.images.map(src => `<img src="${src}" alt="${prop.title}" class="thumbnail">`).join('');
        const statusClass = prop.status.toLowerCase().replace(/\s+/g, '-');

        modalBody.innerHTML = `
          <div class="modal-header">
              <h2>${prop.title}</h2>
              <span class="modal-status status-${statusClass}">${prop.status.toUpperCase()}</span>
          </div>
          <div class="modal-gallery">
              <img src="${mainImage}" alt="${prop.title}" class="main-image">
              <div class="thumbnails">${thumbnailsHtml}</div>
          </div>
        <div class="modal-info">
    <p><strong>Location:</strong> ${prop.location}</p>
    <p><strong>Price:</strong> ${prop.price}</p>
    <p><strong>Type:</strong> ${prop.type}</p>
    <p><strong>Bathrooms:</strong> ${prop.bathrooms || 0}</p>
    <p><strong>Parking:</strong> ${prop.parking || 0}</p>
    <h3>Key Features</h3>
    <ul class="modal-features">${prop.features.map(f => `<li>${f}</li>`).join('')}</ul>
</div>

         <div class="modal-actions">
    <a 
        href="https://wa.me/${prop.whatsapp || '254721911181'}?text=${encodeURIComponent(`Hi, I'm interested in the ${prop.title} at ${prop.location} Price: ${prop.price}`)}" 
        target="_blank" 
        class="btn btn-whatsapp"
    >
        <i class="fab fa-whatsapp"></i> WhatsApp
    </a>
    <a href="contact.html" class="btn btn-secondary">Book Site Visit</a>
</div>

        `;

        const mainImageEl = modalBody.querySelector('.main-image');
       modalBody.addEventListener('click', e => {
    if (e.target.classList.contains('thumbnail')) {
        const mainImageEl = modalBody.querySelector('.main-image');
        if (mainImageEl) mainImageEl.src = e.target.src;
    }
});


        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    modalClose?.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        modalBody.scrollTop = 0;
    });

    /* =========================
       INIT
    ========================== */
    loadProperties();
});
