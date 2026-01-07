// Mobile Menu Toggle
      // Mobile Menu Toggle
 const mobileMenuBtn = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');
const overlay = document.getElementById('overlay');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');

    mobileMenuBtn.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

overlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
});

        // Set current year in footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        
        // Property Filtering System
        const properties = document.querySelectorAll('.property-card');
        const locationFilter = document.getElementById('location');
        const typeFilter = document.getElementById('property-type');
        const priceFilter = document.getElementById('price-range');
        const bedroomsFilter = document.getElementById('bedrooms');
        const statusFilter = document.getElementById('status');
        const applyFiltersBtn = document.getElementById('applyFilters');
        const resetFiltersBtn = document.getElementById('resetFilters');
        const resetFiltersBtn2 = document.getElementById('resetFilters2');
        const noResults = document.getElementById('noResults');
        
        // Apply filters function
        function applyFilters() {
            const locationValue = locationFilter.value;
            const typeValue = typeFilter.value;
            const priceValue = priceFilter.value;
            const bedroomsValue = bedroomsFilter.value;
            const statusValue = statusFilter.value;
            
            let visibleCount = 0;
            
            properties.forEach(property => {
                const location = property.dataset.location;
                const type = property.dataset.type;
                const price = property.dataset.price;
                const bedrooms = property.dataset.bedrooms;
                const status = property.dataset.status;
                
                let show = true;
                
                // Location filter
                if (locationValue !== 'all' && location !== locationValue) {
                    show = false;
                }
                
                // Type filter
                if (typeValue !== 'all' && type !== typeValue) {
                    show = false;
                }
                
                // Price filter
                if (priceValue !== 'all') {
                    const priceNum = parseFloat(price.replace('m', ''));
                    
                    if (priceValue === 'under-5m' && priceNum >= 5) {
                        show = false;
                    } else if (priceValue === '5m-10m' && (priceNum < 5 || priceNum > 10)) {
                        show = false;
                    } else if (priceValue === '10m-20m' && (priceNum < 10 || priceNum > 20)) {
                        show = false;
                    } else if (priceValue === 'over-20m' && priceNum <= 20) {
                        show = false;
                    }
                }
                
                // Bedrooms filter
                if (bedroomsValue !== 'all') {
                    if (bedroomsValue === '4+' && parseInt(bedrooms) < 4) {
                        show = false;
                    } else if (bedroomsValue !== '4+' && bedrooms !== bedroomsValue) {
                        show = false;
                    }
                }
                
                // Status filter
                if (statusValue !== 'all' && status !== statusValue) {
                    show = false;
                }
                
                if (show) {
                    property.style.display = 'block';
                    visibleCount++;
                } else {
                    property.style.display = 'none';
                }
            });
            
            // Show/hide no results message
            if (visibleCount === 0) {
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        }
        
        // Reset filters function
        function resetFilters() {
            locationFilter.value = 'all';
            typeFilter.value = 'all';
            priceFilter.value = 'all';
            bedroomsFilter.value = 'all';
            statusFilter.value = 'available';
            
            properties.forEach(property => {
                property.style.display = 'block';
            });
            
            noResults.style.display = 'none';
        }
        
        // Event listeners for filters
        applyFiltersBtn.addEventListener('click', applyFilters);
        resetFiltersBtn.addEventListener('click', resetFilters);
        resetFiltersBtn2.addEventListener('click', resetFilters);
        
        // Property Details Modal
        const modal = document.getElementById('propertyModal');
        const modalClose = document.getElementById('modalClose');
        const modalBody = document.getElementById('modalBody');
        const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
        
        // Property details data (in a real site, this would come from a database)
        const propertyDetails = {
            1: {
                title: "3-Bedroom Bungalow in Acacia Estate, Kitengela",
                price: "KES 7,500,000",
                location: "Acacia Estate, Kitengela, Kajiado County",
                type: "House / Bungalow",
                size: "1/8 Acre (50x100 ft)",
                bedrooms: "3",
                bathrooms: "3",
                parking: "2",
                features: ["All bedrooms ensuite", "Master bedroom with walk-in closet", "Open-plan kitchen with pantry", "Spacious living area", "Secure compound with gate", "Gated community", "Water and electricity connected"],
                description: "A beautiful 3-bedroom bungalow in the secure Acacia Estate, Kitengela. Perfect for a family looking for a peaceful, secure home with modern finishes. The property is ready for immediate occupation.",
                documentation: ["Clean Title Deed", "Land Search Certificate", "Mutation Form (if applicable)", "Sale Agreement", "KRA PIN Certificate", "Passport/ID Copies"],
                images: [
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=1300&q=80",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1300&q=80",
                    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1300&q=80",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1300&q=80"
                ]
            },
            2: {
                title: "Residential Plot in Legacy Ridges, Ruiru",
                price: "KES 4,500,000",
                location: "Legacy Ridges, Ruiru, Kiambu County",
                type: "Land / Plot",
                size: "50x100 ft",
                bedrooms: "N/A",
                bathrooms: "N/A",
                parking: "N/A",
                features: ["Gated community", "Water connection available", "Electricity available", "Well-graded roads", "Marked beacons", "Flexible payment plans", "Near Tatu City"],
                description: "A prime residential plot in the fast-growing Legacy Ridges estate, Ruiru. Located opposite Tatu City with excellent infrastructure and security. Perfect for building your dream home or investment property.",
                documentation: ["Clean Title Deed", "Land Search Certificate", "Mutation Form", "Sale Agreement", "Approved Survey Plan"],
                images: [
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1300&q=80",
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1300&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1300&q=80"
                ]
            }
        };
        
        // Open modal with property details
        viewDetailsBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const propertyId = btn.dataset.property;
                const property = propertyDetails[propertyId] || propertyDetails[1]; // Fallback to property 1
                
                // Build modal content
                modalBody.innerHTML = `
                    <h2>${property.title}</h2>
                    <div class="property-price" style="font-size: 1.8rem; margin-bottom: 1.5rem;">${property.price}</div>
                    
                    <div class="modal-gallery">
                        ${property.images.map(img => `<img src="${img}" alt="${property.title}">`).join('')}
                    </div>
                    
                    <div class="modal-details">
                        <div>
                            <h3>Property Details</h3>
                            <p><strong>Location:</strong> ${property.location}</p>
                            <p><strong>Property Type:</strong> ${property.type}</p>
                            <p><strong>Size:</strong> ${property.size}</p>
                            <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
                            <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
                            <p><strong>Parking:</strong> ${property.parking}</p>
                            
                            <h3 style="margin-top: 1.5rem;">Key Features</h3>
                            <ul style="list-style-type: disc; padding-left: 1.5rem;">
                                ${property.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div>
                            <h3>Description</h3>
                            <p>${property.description}</p>
                            
                            <div class="documentation-status">
                                <h3>Documentation Status</h3>
                                <p>This property has been verified by Property By Fridah:</p>
                                <ul class="status-list">
                                    ${property.documentation.map(doc => `<li><i class="fas fa-check"></i> ${doc}</li>`).join('')}
                                    <li><i class="fas fa-check"></i> Verified by Property By Fridah</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <a href="https://wa.me/254721911181?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(property.title)}%20(${encodeURIComponent(property.price)})" class="btn btn-whatsapp" target="_blank" style="flex: 1; text-align: center;">
                            <i class="fab fa-whatsapp"></i> WhatsApp About This Property
                        </a>
                        <a href="#contact" class="btn btn-secondary" style="flex: 1; text-align: center;">Book a Site Visit</a>
                    </div>
                `;
                
                // Show modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close modal when clicking outside content
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });