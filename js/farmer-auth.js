const API_BASE_URL=
    "https://agronomy-backend-ehk1.onrender.com";


// Farmer Authentication System
class FarmerAuth {
    constructor() {
        this.currentFarmer = null;
        this.init();
    }
    
    init() {
        // Check if farmer is logged in
        this.checkAuthStatus();
        
        // Initialize forms
        this.initSignupForm();
        this.initLoginForm();
        this.initPasswordReset();
    }
    
    // Check authentication status
    checkAuthStatus() {
        const farmerData = localStorage.getItem('farmerData');
        const authToken = localStorage.getItem('authToken');
        
        if (farmerData && authToken) {
            this.currentFarmer = JSON.parse(farmerData);
            this.updateUIForLoggedInUser();
        }
    }
    
    // Initialize signup form
    initSignupForm() {
        const signupForm = document.getElementById('farmerSignupForm');
        if (!signupForm) return;
        
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                location: document.getElementById('location').value,
                farmSize: document.getElementById('farmSize').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                terms: document.getElementById('terms').checked
            };
            
            // Validate form
            if (!this.validateSignupForm(formData)) {
                return;
            }
            
            // Register farmer
            this.registerFarmer(formData);
        });
    }
    
    // Initialize login form
    initLoginForm() {
        const loginForm = document.getElementById('farmerLoginForm');
        if (!loginForm) return;
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            
            this.loginFarmer(email, password, rememberMe);
        });
    }
    
    // Initialize password reset
    initPasswordReset() {
        const resetForm = document.getElementById('passwordResetForm');
        if (!resetForm) return;
        
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value;
            this.resetPassword(email);
        });
    }
    
    // Validate signup form
    validateSignupForm(data) {
        // Clear previous errors
        this.clearErrors();
        
        let isValid = true;
        
        // Check required fields
        if (!data.fullName.trim()) {
            this.showError('fullName', 'Full name is required');
            isValid = false;
        }
        
        if (!data.email.trim()) {
            this.showError('email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
            this.showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!data.phone.trim()) {
            this.showError('phone', 'Phone number is required');
            isValid = false;
        }
        
        if (!data.location.trim()) {
            this.showError('location', 'Farm location is required');
            isValid = false;
        }
        
        if (!data.farmSize.trim()) {
            this.showError('farmSize', 'Farm size is required');
            isValid = false;
        }
        
        if (!data.password) {
            this.showError('password', 'Password is required');
            isValid = false;
        } else if (data.password.length < 6) {
            this.showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (data.password !== data.confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (!data.terms) {
            this.showError('terms', 'You must accept the terms and conditions');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Register new farmer
    registerFarmer(data) {
        // Check if email already exists
        const existingFarmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const emailExists = existingFarmers.some(farmer => farmer.email === data.email);
        
        if (emailExists) {
            this.showAlert('Email already registered. Please login instead.', 'error');
            return;
        }
        
        // Create farmer object
        const farmer = {
            id: Date.now(),
            ...data,
            registrationDate: new Date().toISOString(),
            status: 'active',
            assessments: [],
            orders: [],
            requests: []
        };
        
        // Remove password confirmation from stored data
        delete farmer.confirmPassword;
        delete farmer.terms;
        
        // Store password separately (in real app, this would be hashed)
        const passwordHash = btoa(data.password); // Simple encoding for demo
        
        // Add to farmers list
        existingFarmers.push(farmer);
        localStorage.setItem('farmers', JSON.stringify(existingFarmers));
        
        // Store password mapping (in real app, use proper auth system)
        const passwords = JSON.parse(localStorage.getItem('farmerPasswords') || '{}');
        passwords[farmer.email] = passwordHash;
        localStorage.setItem('farmerPasswords', JSON.stringify(passwords));
        
        // Auto login
        this.loginFarmer(data.email, data.password, true);
        
        // Show success message
        this.showAlert('Registration successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'farmer-dashboard.html';
        }, 1500);
    }
    
    // Login farmer
    loginFarmer(email, password, rememberMe) {
        // Get farmers data
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const passwords = JSON.parse(localStorage.getItem('farmerPasswords') || '{}');
        
        // Find farmer
        const farmer = farmers.find(f => f.email === email);
        
        if (!farmer) {
            this.showAlert('Invalid email or password', 'error');
            return;
        }
        
        // Check password (in real app, verify hashed password)
        const storedPassword = passwords[email];
        if (btoa(password) !== storedPassword) {
            this.showAlert('Invalid email or password', 'error');
            return;
        }
        
        // Create auth token
        const authToken = btoa(`${email}:${Date.now()}`);
        
        // Store session data
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('farmerData', JSON.stringify(farmer));
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        // Update current farmer
        this.currentFarmer = farmer;
        
        // Show success message
        this.showAlert('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'farmer-dashboard.html';
        }, 1000);
    }
    
    // Logout farmer
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('farmerData');
        this.currentFarmer = null;
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
    
    // Reset password
    resetPassword(email) {
        // Check if email exists
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const farmerExists = farmers.some(f => f.email === email);
        
        if (!farmerExists) {
            this.showAlert('Email not found in our system', 'error');
            return;
        }
        
        // In real app, send password reset email
        this.showAlert('Password reset instructions have been sent to your email', 'success');
        
        // For demo, show the reset link
        setTimeout(() => {
            alert(`Demo: Password reset link would be sent to ${email}\nIn a real application, this would send an email with reset instructions.`);
        }, 500);
    }
    
    // Update password
    updatePassword(currentPassword, newPassword) {
        if (!this.currentFarmer) return false;
        
        const passwords = JSON.parse(localStorage.getItem('farmerPasswords') || '{}');
        const storedPassword = passwords[this.currentFarmer.email];
        
        // Verify current password
        if (btoa(currentPassword) !== storedPassword) {
            this.showAlert('Current password is incorrect', 'error');
            return false;
        }
        
        // Update password
        passwords[this.currentFarmer.email] = btoa(newPassword);
        localStorage.setItem('farmerPasswords', JSON.stringify(passwords));
        
        this.showAlert('Password updated successfully', 'success');
        return true;
    }
    
    // Update farmer profile
    updateProfile(profileData) {
        if (!this.currentFarmer) return false;
        
        // Get current farmers list
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        
        // Find and update farmer
        const index = farmers.findIndex(f => f.id === this.currentFarmer.id);
        if (index !== -1) {
            farmers[index] = { ...farmers[index], ...profileData };
            localStorage.setItem('farmers', JSON.stringify(farmers));
            
            // Update current farmer data
            this.currentFarmer = farmers[index];
            localStorage.setItem('farmerData', JSON.stringify(this.currentFarmer));
            
            return true;
        }
        
        return false;
    }
    
    // Submit farm assessment request
    submitAssessmentRequest(requestData) {
        if (!this.currentFarmer) return false;
        
        // Create assessment request
        const assessmentRequest = {
            id: Date.now(),
            farmerId: this.currentFarmer.id,
            ...requestData,
            date: new Date().toISOString(),
            status: 'pending',
            assignedAgronomist: null,
            scheduledDate: null
        };
        
        // Get existing requests
        const requests = JSON.parse(localStorage.getItem('assessmentRequests') || '[]');
        requests.push(assessmentRequest);
        localStorage.setItem('assessmentRequests', JSON.stringify(requests));
        
        // Add to farmer's requests
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const farmerIndex = farmers.findIndex(f => f.id === this.currentFarmer.id);
        
        if (farmerIndex !== -1) {
            if (!farmers[farmerIndex].requests) {
                farmers[farmerIndex].requests = [];
            }
            farmers[farmerIndex].requests.push(assessmentRequest.id);
            localStorage.setItem('farmers', JSON.stringify(farmers));
            
            // Update current farmer
            this.currentFarmer = farmers[farmerIndex];
            localStorage.setItem('farmerData', JSON.stringify(this.currentFarmer));
        }
        
        return assessmentRequest.id;
    }
    
    // Get farmer's assessment reports
    getAssessmentReports() {
        if (!this.currentFarmer) return [];
        
        const requests = JSON.parse(localStorage.getItem('assessmentRequests') || '[]');
        const reports = JSON.parse(localStorage.getItem('assessmentReports') || '[]');
        
        // Filter reports for this farmer
        const farmerRequests = requests.filter(req => req.farmerId === this.currentFarmer.id);
        const farmerReports = reports.filter(rep => 
            farmerRequests.some(req => req.id === rep.requestId)
        );
        
        return farmerReports;
    }
    
    // Get farmer's orders
    getOrders() {
        if (!this.currentFarmer) return [];
        
        const orders = JSON.parse(localStorage.getItem('farmerOrders') || '[]');
        return orders.filter(order => order.farmerId === this.currentFarmer.id);
    }
    
    // Update UI for logged in user
    updateUIForLoggedInUser() {
        // Update navigation
        const navMenu = document.getElementById('navMenu');
        if (navMenu && this.currentFarmer) {
            const loginItem = navMenu.querySelector('a[href="farmer-login.html"]');
            if (loginItem) {
                loginItem.textContent = 'My Dashboard';
                loginItem.href = 'farmer-dashboard.html';
            }
        }
        
        // Update dashboard welcome message
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement && this.currentFarmer) {
            welcomeElement.textContent = `Welcome, ${this.currentFarmer.fullName}`;
        }
    }
    
    // Helper methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        // Add error class to field
        field.classList.add('error');
        
        // Create error message
        let errorMsg = field.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            field.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        errorMsg.style.color = '#dc3545';
        errorMsg.style.fontSize = '0.85rem';
        errorMsg.style.marginTop = '5px';
    }
    
    clearErrors() {
        // Remove error classes
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        // Remove error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.remove();
        });
    }
    
    showAlert(message, type = 'info') {
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
}

// Initialize farmer auth system
const farmerAuth = new FarmerAuth();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FarmerAuth;

}
