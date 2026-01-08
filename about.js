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

 // Areas Tabs Functionality
const areaTabs = document.querySelectorAll('.area-tab');
const areaDetails = document.querySelectorAll('.area-detail');
const areaImage = document.getElementById('areaImage');

// Area images and alt texts
const areaImages = {
    'kitengela': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'juja': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'ruiru': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'thika': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'athi-river': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
};
const areaAltTexts = {
    'kitengela': 'Kitengela Real Estate Properties',
    'juja': 'Juja Real Estate Properties',
    'ruiru': 'Ruiru Real Estate Properties',
    'thika': 'Thika Real Estate Properties',
    'athi-river': 'Athi River Real Estate Properties'
};

// Switch content on tab click
areaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const areaId = tab.dataset.area;

        // Update tabs
        areaTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Show corresponding content
        areaDetails.forEach(detail => detail.classList.remove('active'));
        document.getElementById(`${areaId}-content`).classList.add('active');

        // Update image
        areaImage.src = areaImages[areaId];
        areaImage.alt = areaAltTexts[areaId];

        // Optional: redirect to properties page
        // window.location.href = `properties.html?location=${areaId}`;
    });
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
      

        
        // Animate stats on scroll
        const statNumbers = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const targetValue = parseInt(statNumber.textContent);
                    const duration = 2000; // 2 seconds
                    const increment = targetValue / (duration / 16); // 60fps
                    let currentValue = 0;
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= targetValue) {
                            statNumber.textContent = targetValue + (statNumber.textContent.includes('%') ? '%' : '+');
                            clearInterval(timer);
                        } else {
                            statNumber.textContent = Math.floor(currentValue) + (statNumber.textContent.includes('%') ? '%' : '+');
                        }
                    }, 16);
                    
                    observer.unobserve(statNumber);
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => observer.observe(stat));