const API_BASE_URL=
    "https://agronomy-backend-ehk1.onrender.com";

// Agronomist Dashboard System
class AgronomistDashboard {
    constructor() {
        this.currentAgronomist = null;
        this.init();
    }
    
    init() {
        // Check authentication
        this.checkAuth();
        
        // Initialize dashboard components
        this.initNavigation();
        this.loadDashboardData();
        this.initEventListeners();
    }
    
    // Check authentication
    checkAuth() {
        const agronomistData = localStorage.getItem('agronomistData');
        const authToken = localStorage.getItem('agronomistToken');
        
        if (!agronomistData || !authToken) {
            window.location.href = 'agronomist-login.html';
            return;
        }
        
        this.currentAgronomist = JSON.parse(agronomistData);
        this.updateUI();
    }
    
    // Update UI with agronomist info
    updateUI() {
        const welcomeElement = document.getElementById('welcomeAgronomist');
        if (welcomeElement && this.currentAgronomist) {
            welcomeElement.textContent = `Welcome, ${this.currentAgronomist.name}`;
        }
    }
    
    // Initialize navigation
    initNavigation() {
        const navLinks = document.querySelectorAll('.sidebar-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show corresponding section
                const sectionId = link.getAttribute('data-section');
                this.showSection(sectionId);
            });
        });
    }
    
    // Show dashboard section
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show selected section
        const selectedSection = document.getElementById(`${sectionId}-section`);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }
        
        // Load section data
        switch(sectionId) {
            case 'customer-records':
                this.loadCustomerRecords();
                break;
            case 'farm-assessments':
                this.loadFarmAssessments();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }
    
    // Load dashboard data
    loadDashboardData() {
        // Update stats
        this.updateStats();
        
        // Load customer records by default
        this.loadCustomerRecords();
    }
    
    // Update dashboard statistics
    updateStats() {
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const requests = JSON.parse(localStorage.getItem('assessmentRequests') || '[]');
        const reports = JSON.parse(localStorage.getItem('assessmentReports') || '[]');
        const orders = JSON.parse(localStorage.getItem('farmerOrders') || '[]');
        
        // Filter pending requests
        const pendingRequests = requests.filter(req => req.status === 'pending');
        const pendingOrders = orders.filter(order => order.status === 'pending');
        
        // Update DOM elements
        document.getElementById('totalCustomers').textContent = farmers.length;
        document.getElementById('assessmentsCount').textContent = reports.length;
        document.getElementById('pendingOrders').textContent = pendingOrders.length;
        
        // Update additional stats if elements exist
        const pendingRequestsElement = document.getElementById('pendingRequests');
        if (pendingRequestsElement) {
            pendingRequestsElement.textContent = pendingRequests.length;
        }
        
        const totalOrdersElement = document.getElementById('totalOrders');
        if (totalOrdersElement) {
            totalOrdersElement.textContent = orders.length;
        }
    }
    
    // Load customer records
    loadCustomerRecords() {
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const tableBody = document.getElementById('customersTableBody');
        
        if (!tableBody) return;
        
        if (farmers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 10px; display: block; color: #ddd;"></i>
                        No customer records found
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        farmers.forEach(farmer => {
            // Get latest assessment date
            const requests = JSON.parse(localStorage.getItem('assessmentRequests') || '[]');
            const farmerRequests = requests.filter(req => req.farmerId === farmer.id);
            const latestAssessment = farmerRequests.length > 0 
                ? new Date(farmerRequests[0].date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
                : 'Not assessed';
            
            html += `
                <tr>
                    <td>${farmer.id}</td>
                    <td>${farmer.fullName}</td>
                    <td>${farmer.phone}</td>
                    <td>${farmer.location}</td>
                    <td>${farmer.farmSize || 'N/A'} acres</td>
                    <td>${latestAssessment}</td>
                    <td>
                        <span class="status status-completed">Active</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view" data-id="${farmer.id}">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="action-btn edit" data-id="${farmer.id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="action-btn delete" data-id="${farmer.id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        
        // Add event listeners to action buttons
        this.addCustomerActionListeners();
    }
    
    // Load farm assessments
    loadFarmAssessments() {
        const requests = JSON.parse(localStorage.getItem('assessmentRequests') || '[]');
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const tableBody = document.getElementById('assessmentsTableBody');
        
        if (!tableBody) return;
        
        if (requests.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-clipboard-list" style="font-size: 2rem; margin-bottom: 10px; display: block; color: #ddd;"></i>
                        No assessment requests found
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        requests.forEach(request => {
            const farmer = farmers.find(f => f.id === request.farmerId);
            const requestDate = new Date(request.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            html += `
                <tr>
                    <td>${request.id}</td>
                    <td>${farmer ? farmer.fullName : 'Unknown Farmer'}</td>
                    <td>${request.farmSize} acres</td>
                    <td>${request.crops || 'Various'}</td>
                    <td>${requestDate}</td>
                    <td>
                        <span class="status status-${request.status}">
                            ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view" data-id="${request.id}" data-type="assessment">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="action-btn edit" data-id="${request.id}" data-type="assessment">
                                <i class="fas fa-edit"></i> Update
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        
        // Add event listeners
        this.addAssessmentActionListeners();
    }
    
    // Load orders
    loadOrders() {
        const orders = JSON.parse(localStorage.getItem('farmerOrders') || '[]');
        const farmers = JSON.parse(localStorage.getItem('farmers') || []);
        const tableBody = document.getElementById('ordersTableBody');
        
        if (!tableBody) return;
        
        if (orders.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 10px; display: block; color: #ddd;"></i>
                        No orders found
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        orders.forEach(order => {
            const farmer = farmers.find(f => f.id === order.farmerId);
            const orderDate = new Date(order.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const total = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
            
            html += `
                <tr>
                    <td>${order.id}</td>
                    <td>${farmer ? farmer.fullName : 'Unknown Farmer'}</td>
                    <td>${order.items?.length || 0} items</td>
                    <td>KSh ${total.toLocaleString()}</td>
                    <td>
                        <span class="status status-${order.status}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view" data-id="${order.id}" data-type="order">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="action-btn edit" data-id="${order.id}" data-type="order">
                                <i class="fas fa-edit"></i> Update
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    // Load reports
    loadReports() {
        const reports = JSON.parse(localStorage.getItem('assessmentReports') || []);
        const tableBody = document.getElementById('reportsTableBody');
        
        if (!tableBody) return;
        
        if (reports.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-file-alt" style="font-size: 2rem; margin-bottom: 10px; display: block; color: #ddd;"></i>
                        No reports generated yet
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        reports.forEach(report => {
            const reportDate = new Date(report.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            html += `
                <tr>
                    <td>${report.id}</td>
                    <td>Report for Farm #${report.requestId}</td>
                    <td>${reportDate}</td>
                    <td>
                        <span class="status status-${report.status}">
                            ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view" data-id="${report.id}" data-type="report">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="action-btn print" data-id="${report.id}" data-type="report">
                                <i class="fas fa-print"></i> Print
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    // Load settings
    loadSettings() {
        // Populate settings form
        document.getElementById('agronomistName').value = this.currentAgronomist.name || '';
        document.getElementById('agronomistEmail').value = this.currentAgronomist.email || '';
        document.getElementById('agronomistPhone').value = this.currentAgronomist.phone || '';
    }
    
    // Add event listeners for customer actions
    addCustomerActionListeners() {
        // View customer
        document.querySelectorAll('.action-btn.view[data-id]').forEach(btn => {
            if (!btn.hasAttribute('data-type')) {
                btn.addEventListener('click', () => {
                    const farmerId = parseInt(btn.getAttribute('data-id'));
                    this.viewCustomer(farmerId);
                });
            }
        });
        
        // Edit customer
        document.querySelectorAll('.action-btn.edit[data-id]').forEach(btn => {
            if (!btn.hasAttribute('data-type')) {
                btn.addEventListener('click', () => {
                    const farmerId = parseInt(btn.getAttribute('data-id'));
                    this.editCustomer(farmerId);
                });
            }
        });
        
        // Delete customer
        document.querySelectorAll('.action-btn.delete[data-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const farmerId = parseInt(btn.getAttribute('data-id'));
                this.deleteCustomer(farmerId);
            });
        });
    }
    
    // Add event listeners for assessment actions
    addAssessmentActionListeners() {
        document.querySelectorAll('.action-btn[data-type="assessment"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const requestId = parseInt(btn.getAttribute('data-id'));
                const action = btn.classList.contains('view') ? 'view' : 'edit';
                
                if (action === 'view') {
                    this.viewAssessment(requestId);
                } else {
                    this.editAssessment(requestId);
                }
            });
        });
    }
    
    // View customer details
    viewCustomer(farmerId) {
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const farmer = farmers.find(f => f.id === farmerId);
        
        if (!farmer) {
            alert('Customer not found');
            return;
        }
        
        // Create modal or show in panel
        const modalHtml = `
            <div class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 600px;">
                    <span class="close-modal" onclick="this.closest('.modal').style.display='none'">&times;</span>
                    <h3 style="color: var(--primary-green); margin-bottom: 20px;">Customer Details</h3>
                    
                    <div style="background-color: var(--light-green); padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <h4 style="color: var(--primary-green); margin-bottom: 15px;">Personal Information</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div>
                                <p><strong>Full Name:</strong> ${farmer.fullName}</p>
                                <p><strong>Phone:</strong> ${farmer.phone}</p>
                                <p><strong>Email:</strong> ${farmer.email || 'Not provided'}</p>
                            </div>
                            <div>
                                <p><strong>Registration Date:</strong> ${new Date(farmer.registrationDate).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> <span class="status status-completed">Active</span></p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <h4 style="color: var(--primary-green); margin-bottom: 15px;">Farm Information</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div>
                                <p><strong>Farm Location:</strong> ${farmer.location}</p>
                                <p><strong>Farm Size:</strong> ${farmer.farmSize || 'N/A'} acres</p>
                            </div>
                            <div>
                                <p><strong>Main Crop:</strong> ${farmer.mainCrop || 'Not specified'}</p>
                                <p><strong>Customer Type:</strong> ${farmer.type || 'Regular Farmer'}</p>
                            </div>
                        </div>
                    </div>
                    
                    ${farmer.notes ? `
                        <div style="background-color: white; padding: 20px; border-radius: 5px; border: 1px solid #eee;">
                            <h4 style="color: var(--primary-green); margin-bottom: 15px;">Notes</h4>
                            <p>${farmer.notes}</p>
                        </div>
                    ` : ''}
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <button onclick="window.print()" class="btn">
                            <i class="fas fa-print"></i> Print Record
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Create and show modal
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
    }
    
    // Edit customer
    editCustomer(farmerId) {
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const farmer = farmers.find(f => f.id === farmerId);
        
        if (!farmer) {
            alert('Customer not found');
            return;
        }
        
        // Show edit form
        const editHtml = `
            <div class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 500px;">
                    <span class="close-modal" onclick="this.closest('.modal').style.display='none'">&times;</span>
                    <h3 style="color: var(--primary-green); margin-bottom: 20px;">Edit Customer</h3>
                    
                    <form id="editCustomerForm">
                        <div class="form-group">
                            <label for="editName">Full Name</label>
                            <input type="text" id="editName" value="${farmer.fullName}" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editPhone">Phone</label>
                                <input type="tel" id="editPhone" value="${farmer.phone}" required>
                            </div>
                            <div class="form-group">
                                <label for="editEmail">Email</label>
                                <input type="email" id="editEmail" value="${farmer.email || ''}">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editLocation">Location</label>
                                <input type="text" id="editLocation" value="${farmer.location}" required>
                            </div>
                            <div class="form-group">
                                <label for="editFarmSize">Farm Size (acres)</label>
                                <input type="number" id="editFarmSize" value="${farmer.farmSize || ''}" step="0.1" min="0">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="editMainCrop">Main Crop</label>
                            <select id="editMainCrop">
                                <option value="">Select crop</option>
                                <option value="avocado" ${farmer.mainCrop === 'avocado' ? 'selected' : ''}>Avocado</option>
                                <option value="mango" ${farmer.mainCrop === 'mango' ? 'selected' : ''}>Mango</option>
                                <option value="pixie" ${farmer.mainCrop === 'pixie' ? 'selected' : ''}>Pixie Oranges</option>
                                <option value="maize" ${farmer.mainCrop === 'maize' ? 'selected' : ''}>Maize</option>
                                <option value="beans" ${farmer.mainCrop === 'beans' ? 'selected' : ''}>Beans</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="editNotes">Notes</label>
                            <textarea id="editNotes" rows="3">${farmer.notes || ''}</textarea>
                        </div>
                        
                        <input type="hidden" id="editFarmerId" value="${farmer.id}">
                        
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button type="submit" class="btn">Save Changes</button>
                            <button type="button" class="btn btn-outline" onclick="this.closest('.modal').style.display='none'">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = editHtml;
        document.body.appendChild(modalContainer);
        
        // Add form submit handler
        setTimeout(() => {
            document.getElementById('editCustomerForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCustomerEdits(farmerId);
            });
        }, 100);
    }
    
    // Save customer edits
    saveCustomerEdits(farmerId) {
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const index = farmers.findIndex(f => f.id === farmerId);
        
        if (index === -1) {
            alert('Customer not found');
            return;
        }
        
        // Get updated values
        const updatedFarmer = {
            ...farmers[index],
            fullName: document.getElementById('editName').value,
            phone: document.getElementById('editPhone').value,
            email: document.getElementById('editEmail').value,
            location: document.getElementById('editLocation').value,
            farmSize: document.getElementById('editFarmSize').value,
            mainCrop: document.getElementById('editMainCrop').value,
            notes: document.getElementById('editNotes').value
        };
        
        // Update in array
        farmers[index] = updatedFarmer;
        localStorage.setItem('farmers', JSON.stringify(farmers));
        
        // Close modal
        document.querySelector('.modal').style.display = 'none';
        
        // Reload customer records
        this.loadCustomerRecords();
        
        alert('Customer updated successfully');
    }
    
    // Delete customer
    deleteCustomer(farmerId) {
        if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            return;
        }
        
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const filteredFarmers = farmers.filter(f => f.id !== farmerId);
        
        if (filteredFarmers.length === farmers.length) {
            alert('Customer not found');
            return;
        }
        
        localStorage.setItem('farmers', JSON.stringify(filteredFarmers));
        this.loadCustomerRecords();
        this.updateStats();
        
        alert('Customer deleted successfully');
    }
    
    // View assessment
    viewAssessment(requestId) {
        const requests = JSON.parse(localStorage.getItem('assessmentRequests') || '[]');
        const request = requests.find(r => r.id === requestId);
        
        if (!request) {
            alert('Assessment request not found');
            return;
        }
        
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        const farmer = farmers.find(f => f.id === request.farmerId);
        
        const requestDate = new Date(request.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        alert(`Assessment Request #${requestId}\n\nFarmer: ${farmer ? farmer.fullName : 'Unknown'}\nDate: ${requestDate}\nFarm Size: ${request.farmSize} acres\nCrops: ${request.crops || 'Various'}\nStatus: ${request.status}\n\nMessage: ${request.message || 'No additional details'}`);
    }
    
    // Edit assessment
    editAssessment(requestId) {
        const requests = JSON.parse(localStorage.getItem('assessmentRequests') || '[]');
        const request = requests.find(r => r.id === requestId);
        
        if (!request) {
            alert('Assessment request not found');
            return;
        }
        
        // Show edit form
        const editHtml = `
            <div class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 500px;">
                    <span class="close-modal" onclick="this.closest('.modal').style.display='none'">&times;</span>
                    <h3 style="color: var(--primary-green); margin-bottom: 20px;">Update Assessment Request</h3>
                    
                    <form id="editAssessmentForm">
                        <div class="form-group">
                            <label for="editStatus">Status</label>
                            <select id="editStatus" required>
                                <option value="pending" ${request.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="scheduled" ${request.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                                <option value="completed" ${request.status === 'completed' ? 'selected' : ''}>Completed</option>
                                <option value="cancelled" ${request.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="editScheduledDate">Scheduled Date</label>
                            <input type="date" id="editScheduledDate" value="${request.scheduledDate || ''}">
                        </div>
                        
                        <div class="form-group">
                            <label for="editAssignedTo">Assigned Agronomist</label>
                            <input type="text" id="editAssignedTo" value="${request.assignedAgronomist || this.currentAgronomist.name}">
                        </div>
                        
                        <div class="form-group">
                            <label for="editNotes">Notes</label>
                            <textarea id="editNotes" rows="4">${request.agronomistNotes || ''}</textarea>
                        </div>
                        
                        <input type="hidden" id="editRequestId" value="${request.id}">
                        
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button type="submit" class="btn">Update</button>
                            <button type="button" class="btn btn-outline" onclick="this.closest('.modal').style.display='none'">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = editHtml;
        document.body.appendChild(modalContainer);
        
        // Add form submit handler
        setTimeout(() => {
            document.getElementById('editAssessmentForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAssessmentEdits(requestId);
            });
        }, 100);
    }
    
    // Save assessment edits
    saveAssessmentEdits(requestId) {
        const requests = JSON.parse(localStorage.getItem('assessmentRequests') || '[]');
        const index = requests.findIndex(r => r.id === requestId);
        
        if (index === -1) {
            alert('Assessment request not found');
            return;
        }
        
        // Get updated values
        const updatedRequest = {
            ...requests[index],
            status: document.getElementById('editStatus').value,
            scheduledDate: document.getElementById('editScheduledDate').value || null,
            assignedAgronomist: document.getElementById('editAssignedTo').value || this.currentAgronomist.name,
            agronomistNotes: document.getElementById('editNotes').value
        };
        
        // If status changed to completed, create report
        if (updatedRequest.status === 'completed' && requests[index].status !== 'completed') {
            this.createAssessmentReport(updatedRequest);
        }
        
        // Update in array
        requests[index] = updatedRequest;
        localStorage.setItem('assessmentRequests', JSON.stringify(requests));
        
        // Close modal
        document.querySelector('.modal').style.display = 'none';
        
        // Reload assessments
        this.loadFarmAssessments();
        
        alert('Assessment updated successfully');
    }
    
    // Create assessment report
    createAssessmentReport(request) {
        const reports = JSON.parse(localStorage.getItem('assessmentReports') || '[]');
        
        const newReport = {
            id: Date.now(),
            requestId: request.id,
            farmerId: request.farmerId,
            date: new Date().toISOString(),
            agronomist: this.currentAgronomist.name,
            status: 'completed',
            summary: `Farm assessment completed by ${this.currentAgronomist.name}. Recommendations provided.`,
            recommendations: [
                'Implement proper irrigation system',
                'Schedule regular pest control',
                'Consider crop rotation for soil health'
            ],
            notes: request.agronomistNotes || ''
        };
        
        reports.push(newReport);
        localStorage.setItem('assessmentReports', JSON.stringify(reports));
    }
    
    // Initialize event listeners
    initEventListeners() {
        // Search customers
        const searchInput = document.getElementById('searchCustomers');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchCustomers(e.target.value);
            });
        }
        
        // Export customers button
        const exportBtn = document.getElementById('exportCustomersBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCustomers();
            });
        }
        
        // Add customer form
        const addCustomerForm = document.getElementById('newCustomerForm');
        if (addCustomerForm) {
            addCustomerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewCustomer();
            });
        }
        
        // Settings form - Profile update
        const profileForm = document.getElementById('agronomistProfileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }
        
        // Settings form - Password change
        const passwordForm = document.getElementById('agronomistPasswordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Print button
        const printBtn = document.getElementById('printRecordsBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }
    
    // Search customers
    searchCustomers(searchTerm) {
        const tableBody = document.getElementById('customersTableBody');
        if (!tableBody) return;
        
        const rows = tableBody.getElementsByTagName('tr');
        const searchLower = searchTerm.toLowerCase();
        
        for (let row of rows) {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchLower)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
    
    // Export customers
    exportCustomers() {
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        
        if (farmers.length === 0) {
            alert('No customers to export');
            return;
        }
        
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "ID,Name,Phone,Email,Location,Farm Size,Main Crop,Registration Date\n";
        
        farmers.forEach(farmer => {
            const row = [
                farmer.id,
                `"${farmer.fullName}"`,
                farmer.phone,
                farmer.email || '',
                `"${farmer.location}"`,
                farmer.farmSize || '',
                farmer.mainCrop || '',
                farmer.registrationDate || ''
            ].join(',');
            
            csvContent += row + "\n";
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customers.csv");
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        document.body.removeChild(link);
        
        alert('Customers exported successfully as CSV file');
    }
    
    // Add new customer
    addNewCustomer() {
        const form = document.getElementById('newCustomerForm');
        const formData = {
            fullName: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            location: document.getElementById('farmLocation').value,
            farmSize: document.getElementById('farmSize').value,
            mainCrop: document.getElementById('mainCrop').value,
            type: document.getElementById('customerType').value,
            registrationDate: document.getElementById('registrationDate').value || new Date().toISOString().split('T')[0],
            notes: document.getElementById('customerNotes').value
        };
        
        // Validate required fields
        if (!formData.fullName || !formData.phone || !formData.location) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Get existing farmers
        const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
        
        // Create new farmer
        const newFarmer = {
            id: Date.now(),
            ...formData,
            status: 'active'
        };
        
        // Add to farmers array
        farmers.push(newFarmer);
        localStorage.setItem('farmers', JSON.stringify(farmers));
        
        // Reset form
        form.reset();
        
        // Reload customer records
        this.loadCustomerRecords();
        this.updateStats();
        
        // Switch to customer records view
        this.showSection('customer-records');
        
        alert('Customer added successfully');
    }
    
    // Update agronomist profile
    updateProfile() {
        const profileData = {
            name: document.getElementById('agronomistName').value,
            email: document.getElementById('agronomistEmail').value,
            phone: document.getElementById('agronomistPhone').value
        };
        
        // Update in localStorage
        this.currentAgronomist = { ...this.currentAgronomist, ...profileData };
        localStorage.setItem('agronomistData', JSON.stringify(this.currentAgronomist));
        
        // Update UI
        this.updateUI();
        
        alert('Profile updated successfully');
    }
    
    // Change password
    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters');
            return;
        }
        
        // In a real app, verify current password with server
        // For demo, we'll just update it
        const passwords = JSON.parse(localStorage.getItem('agronomistPasswords') || '{}');
        passwords[this.currentAgronomist.email] = btoa(newPassword);
        localStorage.setItem('agronomistPasswords', JSON.stringify(passwords));
        
        // Clear form
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        alert('Password changed successfully');
    }
    
    // Logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('agronomistToken');
            localStorage.removeItem('agronomistData');
            window.location.href = 'agronomist-login.html';
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new AgronomistDashboard();
    
    // Make dashboard available globally for button clicks
    window.agronomistDashboard = dashboard;
});

