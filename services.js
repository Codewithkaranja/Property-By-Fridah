document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------
    // Mobile Menu Toggle
    // ---------------------------
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

    // ---------------------------
    // Testimonials Slider
    // ---------------------------
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.classList.remove('active');
            if (i === index) t.classList.add('active');
        });
    }

    if (testimonials.length > 1) {
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 3000); // every 3 seconds
    }

    showTestimonial(0);

    // ---------------------------
    // Set current year in footer
    // ---------------------------
    const yearElem = document.getElementById('currentYear');
    if (yearElem) yearElem.textContent = new Date().getFullYear();

    // ---------------------------
    // Smooth Scrolling for Anchors
    // ---------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------------------------
    // Service Tabs
    // ---------------------------
   // ---------------------------
// Service Tabs
// ---------------------------
const tabBtns = document.querySelectorAll('.tab-btn');
const serviceContents = document.querySelectorAll('.service-detail');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab; // e.g., "property-sales"
        const targetContent = document.getElementById(`${tabId}-content`);

        if (!targetContent) return; // safety check

        // Remove active classes from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        serviceContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        targetContent.classList.add('active');
    });
});

});

