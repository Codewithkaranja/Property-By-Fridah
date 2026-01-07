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
        
        // Contact Form Submission
        const contactForm = document.getElementById('propertyInquiryForm');
        const successMessage = document.getElementById('successMessage');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value;
            const phone = document.getElementById('phone').value;
            const propertyType = document.getElementById('propertyType').value;
            const location = document.getElementById('location').value;
            const message = document.getElementById('message').value;
            
            // Create WhatsApp message
            let whatsappMessage = `Hello Property by Fridah,%0A%0A`;
            whatsappMessage += `I'm interested in property consultation.%0A`;
            whatsappMessage += `Name: ${firstName}%0A`;
            whatsappMessage += `Phone: ${phone}%0A`;
            
            if (propertyType) {
                whatsappMessage += `Property Type: ${propertyType}%0A`;
            }
            
            if (location) {
                whatsappMessage += `Location: ${location}%0A`;
            }
            
            whatsappMessage += `Message: ${message}%0A%0A`;
            whatsappMessage += `Please contact me with available properties.`;
            
            // Open WhatsApp with pre-filled message
            window.open(`https://wa.me/254721911181?text=${whatsappMessage}`, '_blank');
            
            // Show success message
            successMessage.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 10 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 10000);
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
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('0')) {
                value = '+254' + value.substring(1);
            } else if (value.startsWith('254')) {
                value = '+' + value;
            } else if (value.startsWith('7') && value.length === 9) {
                value = '+254' + value;
            }
            
            e.target.value = value;
        });
        
        // Auto-populate email if available from localStorage (for returning visitors)
        window.addEventListener('DOMContentLoaded', () => {
            const savedEmail = localStorage.getItem('propertyByFridahEmail');
            if (savedEmail) {
                document.getElementById('email').value = savedEmail;
            }
            
            // Save email on form submit
            contactForm.addEventListener('submit', () => {
                const email = document.getElementById('email').value;
                if (email) {
                    localStorage.setItem('propertyByFridahEmail', email);
                }
            });
        });