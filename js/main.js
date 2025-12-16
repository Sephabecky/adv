// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function() {
        navMenu.classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
}

// Close mobile menu when clicking links
const navLinks = document.querySelectorAll('#navMenu a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.classList.remove('error');
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
                
                // Add error message
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    errorMsg.style.color = '#dc3545';
                    errorMsg.style.fontSize = '0.85rem';
                    errorMsg.style.marginTop = '5px';
                    input.parentNode.appendChild(errorMsg);
                }
            } else {
                // Remove error message if exists
                const errorMsg = input.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
        
        if (isValid) {
            // Show success message
            showAlert('Form submitted successfully!', 'success');
            form.reset();
            
            // In a real app, you would send data to server here
            console.log('Form submitted:', new FormData(form));
        } else {
            showAlert('Please fill in all required fields', 'error');
        }
    });
}

// Alert System
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button class="close-alert">&times;</button>
    `;
    
    // Add to page
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alert, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = alert.querySelector('.close-alert');
    closeBtn.addEventListener('click', () => {
        alert.remove();
    });
}

// Image Loading Fallback
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            console.log(`Image failed to load: ${this.src}`);
            this.style.display = 'none';
            
            // Create fallback
            const parent = this.parentNode;
            if (!parent.querySelector('.img-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'img-fallback';
                fallback.style.height = this.offsetHeight + 'px';
                fallback.style.backgroundColor = '#f0f0f0';
                fallback.style.display = 'flex';
                fallback.style.alignItems = 'center';
                fallback.style.justifyContent = 'center';
                fallback.innerHTML = `<i class="fas fa-image" style="color: #ccc; font-size: 2rem;"></i>`;
                parent.appendChild(fallback);
            }
        };
    });
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            // Don't interfere with other hash links
            if (href.includes('?')) return;
            
            e.preventDefault();
            
            const targetId = href;
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Print Functionality
function initPrintButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.print-btn')) {
            e.preventDefault();
            window.print();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common functions
    handleImageErrors();
    initSmoothScroll();
    initPrintButtons();
    
    // Initialize form validation for all forms on page
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.id) {
            validateForm(form.id);
        }
    });
    
    // Check for logo
    const logoImg = document.querySelector('.logo-img img');
    if (logoImg) {
        logoImg.onload = function() {
            console.log('Logo loaded successfully');
        };
    }
});