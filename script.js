// Enhanced Sample Data
const sampleData = {
    // Valid credentials for login
    validCredentials: {
        farmer: [
            { email: "farmer@demo.com", password: "farmer123", name: "John Agritech" },
            { email: "farmer2@demo.com", password: "farmer123", name: "Mary Farmwell" }
        ],
        agronomist: [
            { email: "agro@demo.com", password: "agro123", name: "Dr. Sarah Agronomics" },
            { email: "agro2@demo.com", password: "agro123", name: "Dr. James Farmex" }
        ]
    },
    
    // Farmers data
    farmers: [
        { id: 1, name: "John Agritech", email: "john@agritech.com", phone: "+254 712 345 678", location: "Nakuru County", farms: "Main Farm, North Field", status: "Active" },
        { id: 2, name: "Mary Farmwell", email: "mary@farmwell.com", phone: "+254 723 456 789", location: "Kiambu County", farms: "Green Valley Farm", status: "Active" },
        { id: 3, name: "Robert Cropland", email: "robert@cropland.com", phone: "+254 734 567 890", location: "Uasin Gishu", farms: "Highland Farm", status: "Active" },
        { id: 4, name: "Susan Greenfield", email: "susan@greenfield.com", phone: "+254 745 678 901", location: "Meru County", farms: "Coffee Plantation", status: "Inactive" }
    ],
    
    // Farm orders
    farmOrders: [
        { id: 1, orderId: "ORD-001", farmer: "John Agritech", item: "Fertilizer", quantity: "50 bags", date: "2023-11-15", status: "Pending", notes: "NPK fertilizer" },
        { id: 2, orderId: "ORD-002", farmer: "John Agritech", item: "Seeds", quantity: "100 kg", date: "2023-11-10", status: "Completed", notes: "Maize seeds" },
        { id: 3, orderId: "ORD-003", farmer: "Mary Farmwell", item: "Pesticides", quantity: "20 liters", date: "2023-11-12", status: "Processing", notes: "Organic pesticide" }
    ],
    
    // Reports
    reports: [
        { id: 1, reportId: "REP-001", type: "Soil Analysis", farmer: "John Agritech", date: "2023-11-05", summary: "Soil pH levels optimal for maize cultivation", status: "Completed", recommendations: "Maintain current soil management practices" },
        { id: 2, reportId: "REP-002", type: "Crop Assessment", farmer: "John Agritech", date: "2023-11-10", summary: "Maize crop showing good growth, recommend fertilization", status: "Completed", recommendations: "Apply fertilizer in 2 weeks" },
        { id: 3, reportId: "REP-003", type: "Farm Assessment", farmer: "All Farmers", date: "2023-11-01", summary: "Quarterly assessment shows 15% yield improvement", status: "Published", recommendations: "Continue with current irrigation schedule" }
    ],
    
    // Scheduled visits
    scheduledVisits: [
        { id: 1, farmer: "John Agritech", date: "2023-11-20", time: "10:00 AM", purpose: "Soil Testing", status: "Scheduled", notes: "Check soil nutrient levels" },
        { id: 2, farmer: "Mary Farmwell", date: "2023-11-22", time: "2:00 PM", purpose: "Crop Assessment", status: "Scheduled", notes: "Assess maize crop growth" },
        { id: 3, farmer: "Robert Cropland", date: "2023-11-18", time: "9:00 AM", purpose: "Harvest Planning", status: "Completed", notes: "Harvest scheduled for Dec 10" }
    ],
    
    // Sales data with profit tracking
    sales: [
        { id: 1, farmer: "John Agritech", crop: "Maize", quantity: 500, unit: "kg", pricePerUnit: 0.85, costPrice: 0.45, startingPrice: 0.80, date: "2023-11-10", buyer: "Grain Co Ltd", profit: 200, total: 425 },
        { id: 2, farmer: "John Agritech", crop: "Wheat", quantity: 300, unit: "kg", pricePerUnit: 1.20, costPrice: 0.65, startingPrice: 1.15, date: "2023-11-12", buyer: "Bakery Supplies", profit: 165, total: 360 },
        { id: 3, farmer: "Mary Farmwell", crop: "Vegetables", quantity: 150, unit: "kg", pricePerUnit: 2.50, costPrice: 1.20, startingPrice: 2.30, date: "2023-11-08", buyer: "Fresh Market", profit: 195, total: 375 },
        { id: 4, farmer: "Robert Cropland", crop: "Coffee", quantity: 100, unit: "kg", pricePerUnit: 5.75, costPrice: 3.20, startingPrice: 5.50, date: "2023-11-05", buyer: "Coffee Exporters", profit: 255, total: 575 }
    ]
};

// DOM Elements
const loginPage = document.getElementById('loginPage');
const farmerDashboard = document.getElementById('farmerDashboard');
const agronomistDashboard = document.getElementById('agronomistDashboard');
const farmerType = document.getElementById('farmerType');
const agronomistType = document.getElementById('agronomistType');
const loginForm = document.getElementById('loginForm');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginError = document.getElementById('loginError');
const farmerLogout = document.getElementById('farmerLogout');
const agronomistLogout = document.getElementById('agronomistLogout');

// Modal elements
const addFarmerModal = document.getElementById('addFarmerModal');
const scheduleVisitModal = document.getElementById('scheduleVisitModal');
const newOrderModal = document.getElementById('newOrderModal');
const generateReportModal = document.getElementById('generateReportModal');
const addSaleModal = document.getElementById('addSaleModal');
const editRecordModal = document.getElementById('editRecordModal');
const viewSalesModal = document.getElementById('viewSalesModal');

// Current user
let currentUserType = 'farmer';
let currentUser = null;
let isLoggedIn = false;

// Initialize the application
function init() {
    // Set today's date for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visitDate')?.setAttribute('min', today);
    document.getElementById('reportDateFrom')?.setAttribute('max', today);
    document.getElementById('reportDateTo')?.setAttribute('max', today);
    document.getElementById('saleDate')?.setAttribute('max', today);
    
    // Set default dates
    document.getElementById('reportDateFrom')?.setAttribute('value', '2023-11-01');
    document.getElementById('reportDateTo')?.setAttribute('value', today);
    
    // Event listeners
    farmerType.addEventListener('click', () => setUserType('farmer'));
    agronomistType.addEventListener('click', () => setUserType('agronomist'));
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout buttons
    farmerLogout.addEventListener('click', logout);
    agronomistLogout.addEventListener('click', logout);
    
    // Modal open buttons
    document.getElementById('addFarmerBtn')?.addEventListener('click', () => openModal('addFarmerModal'));
    document.getElementById('scheduleVisitBtn')?.addEventListener('click', () => openModal('scheduleVisitModal'));
    document.getElementById('newOrderBtn')?.addEventListener('click', () => openModal('newOrderModal'));
    document.getElementById('generateReportBtn')?.addEventListener('click', () => openModal('generateReportModal'));
    document.getElementById('addSaleBtn')?.addEventListener('click', () => openModal('addSaleModal'));
    document.getElementById('viewSalesBtn')?.addEventListener('click', () => openModal('viewSalesModal'));
    
    // Modal close buttons
    document.getElementById('closeFarmerModal')?.addEventListener('click', () => closeModal('addFarmerModal'));
    document.getElementById('closeVisitModal')?.addEventListener('click', () => closeModal('scheduleVisitModal'));
    document.getElementById('closeOrderModal')?.addEventListener('click', () => closeModal('newOrderModal'));
    document.getElementById('closeReportModal')?.addEventListener('click', () => closeModal('generateReportModal'));
    document.getElementById('closeSaleModal')?.addEventListener('click', () => closeModal('addSaleModal'));
    document.getElementById('closeEditModal')?.addEventListener('click', () => closeModal('editRecordModal'));
    document.getElementById('closeSalesModal')?.addEventListener('click', () => closeModal('viewSalesModal'));
    
    // Form submissions
    document.getElementById('addFarmerForm')?.addEventListener('submit', handleAddFarmer);
    document.getElementById('scheduleVisitForm')?.addEventListener('submit', handleScheduleVisit);
    document.getElementById('newOrderForm')?.addEventListener('submit', handleNewOrder);
    document.getElementById('generateReportForm')?.addEventListener('submit', handleGenerateReport);
    document.getElementById('addSaleForm')?.addEventListener('submit', handleAddSale);
    document.getElementById('editRecordForm')?.addEventListener('submit', handleEditRecord);
    
    // Delete button
    document.getElementById('deleteRecordBtn')?.addEventListener('click', handleDeleteRecord);
    
    // Download buttons
    document.getElementById('downloadFarmersList')?.addEventListener('click', downloadFarmersList);
    document.getElementById('downloadFarmerOrders')?.addEventListener('click', downloadFarmerOrders);
    document.getElementById('downloadFarmerReports')?.addEventListener('click', downloadFarmerReports);
    document.getElementById('downloadProfitSheet')?.addEventListener('click', downloadProfitSheet);
    document.getElementById('printFarmerReports')?.addEventListener('click', printFarmerReports);
    document.getElementById('printFarmersRecords')?.addEventListener('click', printFarmersRecords);
    document.getElementById('downloadSalesProfitSheet')?.addEventListener('click', downloadSalesProfitSheet);
    document.getElementById('downloadAllReports')?.addEventListener('click', downloadAllReports);
    document.getElementById('downloadAllSales')?.addEventListener('click', downloadAllSales);
    
    // Profile update buttons
    document.getElementById('updateFarmerProfile')?.addEventListener('click', updateFarmerProfile);
    document.getElementById('updateAgronomistProfile')?.addEventListener('click', updateAgronomistProfile);
    document.getElementById('resetPassword')?.addEventListener('click', resetPassword);
    
    // Initialize data displays
    loadFarmersData();
    loadFarmerOrders();
    loadReports();
    loadScheduledVisits();
    loadSalesData();
    loadProfitAnalysis();
    
    // Populate dropdowns
    populateFarmerDropdowns();
    
    // Auto-fill demo credentials
    autoFillCredentials();
}

// Auto-fill credentials based on selected user type
function autoFillCredentials() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    farmerType.addEventListener('click', () => {
        emailInput.value = 'farmer@demo.com';
        passwordInput.value = 'farmer123';
    });
    
    agronomistType.addEventListener('click', () => {
        emailInput.value = 'agro@demo.com';
        passwordInput.value = 'agro123';
    });
    
    // Set initial values
    emailInput.value = 'farmer@demo.com';
    passwordInput.value = 'farmer123';
}

// Set user type for login
function setUserType(type) {
    currentUserType = type;
    
    if (type === 'farmer') {
        farmerType.classList.add('active');
        agronomistType.classList.remove('active');
        loginSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login as Farmer';
        
        // Auto-fill farmer credentials
        document.getElementById('email').value = 'farmer@demo.com';
        document.getElementById('password').value = 'farmer123';
    } else {
        agronomistType.classList.add('active');
        farmerType.classList.remove('active');
        loginSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login as Agronomist';
        
        // Auto-fill agronomist credentials
        document.getElementById('email').value = 'agro@demo.com';
        document.getElementById('password').value = 'agro123';
    }
}

// Handle login with password validation
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate credentials
    if (!email || !password) {
        showLoginError('Please enter both email and password');
        return;
    }
    
    // Find user in valid credentials
    const userType = currentUserType;
    const user = sampleData.validCredentials[userType].find(
        cred => cred.email === email && cred.password === password
    );
    
    if (!user) {
        showLoginError('Invalid email or password. Please use demo credentials shown above.');
        return;
    }
    
    // Successful login
    currentUser = user;
    loginError.style.display = 'none';
    isLoggedIn = true;
    
    if (currentUserType === 'farmer') {
        loginPage.style.display = 'none';
        farmerDashboard.style.display = 'block';
        agronomistDashboard.style.display = 'none';
        
        // Update farmer name in dashboard
        document.querySelector('#farmerDashboard .user-avatar').textContent = 
            user.name.split(' ').map(n => n[0]).join('');
        document.querySelector('#farmerDashboard .user-info h4').textContent = user.name;
        
        // Load farmer-specific data
        loadFarmerOrders();
        loadFarmerSales();
    } else {
        loginPage.style.display = 'none';
        farmerDashboard.style.display = 'none';
        agronomistDashboard.style.display = 'block';
        
        // Update agronomist name in dashboard
        document.querySelector('#agronomistDashboard .user-avatar').textContent = 
            user.name.split(' ').map(n => n[0]).join('');
        document.querySelector('#agronomistDashboard .user-info h4').textContent = user.name;
        
        // Load agronomist data
        loadFarmersData();
        loadAllSales();
    }
    
    // Clear form
    loginForm.reset();
}

function showLoginError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    loginPage.style.display = 'flex';
    farmerDashboard.style.display = 'none';
    agronomistDashboard.style.display = 'none';
    loginForm.reset();
    loginError.style.display = 'none';
    
    // Auto-fill credentials again
    autoFillCredentials();
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    
    // If opening view sales modal, load data
    if (modalId === 'viewSalesModal') {
        loadAllSalesTable();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Load farmers data for agronomist with edit/delete buttons
function loadFarmersData() {
    const farmersTable = document.getElementById('farmersTable');
    if (!farmersTable) return;
    
    farmersTable.innerHTML = '';
    
    sampleData.farmers.forEach(farmer => {
        const row = `
            <tr>
                <td>${farmer.name}</td>
                <td>${farmer.location}</td>
                <td>${farmer.phone}</td>
                <td><span class="status-badge ${farmer.status === 'Active' ? 'status-completed' : 'status-pending'}">${farmer.status}</span></td>
                <td class="no-print">
                    <button class="btn-action btn-edit" onclick="editRecord('farmer', ${farmer.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-action btn-delete" onclick="deleteRecord('farmer', ${farmer.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-trash"></i> Delete</button>
                </td>
            </tr>
        `;
        farmersTable.innerHTML += row;
    });
    
    // Update stats
    updateAgronomistStats();
}

// Update agronomist stats
function updateAgronomistStats() {
    document.getElementById('totalFarmers').textContent = sampleData.farmers.length;
    document.getElementById('totalAssessments').textContent = sampleData.scheduledVisits.length * 3;
    document.getElementById('totalReports').textContent = sampleData.reports.length;
    document.getElementById('totalOrders').textContent = sampleData.farmOrders.length;
    
    // Calculate total sales and profit
    let totalSales = 0;
    let totalProfit = 0;
    
    sampleData.sales.forEach(sale => {
        totalSales += sale.quantity;
        totalProfit += sale.profit;
    });
    
    document.getElementById('totalSales').textContent = totalSales.toLocaleString();
    document.getElementById('totalProfit').textContent = `$${totalProfit.toLocaleString()}`;
}

// Load farmer orders with edit/delete buttons
function loadFarmerOrders() {
    const ordersTable = document.getElementById('farmOrdersTable');
    if (!ordersTable) return;
    
    ordersTable.innerHTML = '';
    
    // Filter orders for current farmer
    const farmerName = currentUser ? currentUser.name : "John Agritech";
    const farmerOrders = sampleData.farmOrders.filter(order => order.farmer === farmerName);
    
    if (farmerOrders.length === 0) {
        ordersTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: var(--gray);">
                    No orders found. Create your first order!
                </td>
            </tr>
        `;
    } else {
        farmerOrders.forEach(order => {
            const row = `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.item}</td>
                    <td>${order.quantity}</td>
                    <td>${order.date}</td>
                    <td><span class="status-badge ${order.status === 'Completed' ? 'status-completed' : order.status === 'Processing' ? 'status-scheduled' : 'status-pending'}">${order.status}</span></td>
                    <td class="no-print">
                        <button class="btn-action btn-edit" onclick="editRecord('order', ${order.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-action btn-delete" onclick="deleteRecord('order', ${order.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                </tr>
            `;
            ordersTable.innerHTML += row;
        });
    }
}

// Load reports for both dashboards
function loadReports() {
    // Farmer reports
    const farmerReports = document.getElementById('farmerReports');
    if (farmerReports) {
        farmerReports.innerHTML = '';
        
        const farmerName = currentUser ? currentUser.name : "John Agritech";
        
        // Filter reports for current farmer
        const filteredReports = sampleData.reports.filter(report => 
            report.farmer === farmerName || report.farmer === "All Farmers"
        );
        
        if (filteredReports.length === 0) {
            farmerReports.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--gray);">No reports available yet.</p>';
        } else {
            filteredReports.forEach(report => {
                const reportCard = `
                    <div class="produce-item" style="margin-bottom: 15px; padding: 15px; border: 1px solid var(--light-gray); border-radius: 8px;">
                        <div class="produce-info">
                            <h4>${report.type} - ${report.date}</h4>
                            <p><strong>Summary:</strong> ${report.summary}</p>
                            <p><strong>Status:</strong> <span class="status-badge ${report.status === 'Completed' || report.status === 'Published' ? 'status-completed' : 'status-pending'}">${report.status}</span></p>
                            <div class="no-print" style="margin-top: 10px;">
                                <button class="btn-action btn-edit" onclick="editRecord('report', ${report.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn-action btn-delete" onclick="deleteRecord('report', ${report.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                farmerReports.innerHTML += reportCard;
            });
        }
    }
    
    // Agronomist reports
    const agronomistReports = document.getElementById('agronomistReports');
    if (agronomistReports) {
        agronomistReports.innerHTML = '';
        
        if (sampleData.reports.length === 0) {
            agronomistReports.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--gray);">No reports generated yet. Create your first report!</p>';
        } else {
            sampleData.reports.forEach(report => {
                const reportCard = `
                    <div class="produce-item" style="margin-bottom: 15px; padding: 15px; border: 1px solid var(--light-gray); border-radius: 8px;">
                        <div class="produce-info">
                            <h4>${report.reportId}: ${report.type} (${report.farmer})</h4>
                            <p><strong>Date:</strong> ${report.date}</p>
                            <p><strong>Summary:</strong> ${report.summary}</p>
                            <p><strong>Status:</strong> <span class="status-badge ${report.status === 'Completed' || report.status === 'Published' ? 'status-completed' : 'status-pending'}">${report.status}</span></p>
                            <div class="no-print" style="margin-top: 10px;">
                                <button class="btn-action btn-edit" onclick="editRecord('report', ${report.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn-action btn-delete" onclick="deleteRecord('report', ${report.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                agronomistReports.innerHTML += reportCard;
            });
        }
    }
}

// Load sales data for farmer
function loadFarmerSales() {
    const farmerSalesDiv = document.getElementById('farmerSales');
    if (!farmerSalesDiv) return;
    
    const farmerName = currentUser ? currentUser.name : "John Agritech";
    const farmerSales = sampleData.sales.filter(sale => sale.farmer === farmerName);
    
    if (farmerSales.length === 0) {
        farmerSalesDiv.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--gray);">No sales recorded yet. Add your first sale!</p>';
        return;
    }
    
    let totalProfit = 0;
    let totalSales = 0;
    
    farmerSalesDiv.innerHTML = '<table class="data-table"><thead><tr><th>Date</th><th>Crop</th><th>Quantity</th><th>Total</th><th>Profit</th><th class="no-print">Actions</th></tr></thead><tbody>';
    
    farmerSales.forEach(sale => {
        totalProfit += sale.profit;
        totalSales += sale.quantity;
        
        farmerSalesDiv.innerHTML += `
            <tr>
                <td>${sale.date}</td>
                <td>${sale.crop}</td>
                <td>${sale.quantity} ${sale.unit}</td>
                <td>$${sale.total.toFixed(2)}</td>
                <td>$${sale.profit.toFixed(2)}</td>
                <td class="no-print">
                    <button class="btn-action btn-edit" onclick="editRecord('sale', ${sale.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-action btn-delete" onclick="deleteRecord('sale', ${sale.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-trash"></i> Delete</button>
                </td>
            </tr>
        `;
    });
    
    farmerSalesDiv.innerHTML += '</tbody></table>';
    
    // Update farmer stats
    document.querySelector('#farmerDashboard .stats-grid .stat-icon.sales + .stat-info h3').textContent = totalSales;
    document.querySelector('#farmerDashboard .stats-grid .stat-icon.profit + .stat-info h3').textContent = `$${totalProfit.toFixed(2)}`;
}

// Load all sales for agronomist
function loadAllSales() {
    const profitAnalysisDiv = document.getElementById('profitAnalysis');
    if (!profitAnalysisDiv) return;
    
    // Group sales by farmer
    const salesByFarmer = {};
    sampleData.sales.forEach(sale => {
        if (!salesByFarmer[sale.farmer]) {
            salesByFarmer[sale.farmer] = {
                totalSales: 0,
                totalProfit: 0,
                sales: []
            };
        }
        salesByFarmer[sale.farmer].totalSales += sale.quantity;
        salesByFarmer[sale.farmer].totalProfit += sale.profit;
        salesByFarmer[sale.farmer].sales.push(sale);
    });
    
    // Display top farms
    let html = '';
    Object.keys(salesByFarmer).forEach(farmer => {
        const data = salesByFarmer[farmer];
        html += `
            <div style="margin-bottom: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
                <h5 style="margin-bottom: 10px; color: var(--primary);">${farmer}</h5>
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <p style="font-size: 12px; color: var(--gray);">Total Sales</p>
                        <p style="font-weight: bold;">${data.totalSales.toLocaleString()} kg</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: var(--gray);">Total Profit</p>
                        <p style="font-weight: bold; color: var(--success);">$${data.totalProfit.toLocaleString()}</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: var(--gray);">Avg. Profit/kg</p>
                        <p style="font-weight: bold;">$${(data.totalProfit / data.totalSales).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    profitAnalysisDiv.innerHTML = html;
}

// Load all sales for modal table
function loadAllSalesTable() {
    const allSalesTable = document.getElementById('allSalesTable');
    if (!allSalesTable) return;
    
    allSalesTable.innerHTML = '';
    
    sampleData.sales.forEach(sale => {
        const row = `
            <tr>
                <td>${sale.date}</td>
                <td>${sale.crop}</td>
                <td>${sale.quantity} ${sale.unit}</td>
                <td>$${sale.pricePerUnit.toFixed(2)}</td>
                <td>$${sale.total.toFixed(2)}</td>
                <td>$${sale.profit.toFixed(2)}</td>
            </tr>
        `;
        allSalesTable.innerHTML += row;
    });
}

// Load scheduled visits
function loadScheduledVisits() {
    const scheduledVisitsDiv = document.getElementById('scheduledVisits');
    if (!scheduledVisitsDiv) return;
    
    scheduledVisitsDiv.innerHTML = '';
    
    if (sampleData.scheduledVisits.length === 0) {
        scheduledVisitsDiv.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--gray);">No visits scheduled yet.</p>';
    } else {
        sampleData.scheduledVisits.forEach(visit => {
            const visitCard = `
                <div class="produce-item" style="margin-bottom: 15px; padding: 15px; border: 1px solid var(--light-gray); border-radius: 8px;">
                    <div class="produce-info">
                        <h4>${visit.farmer} - ${visit.date} at ${visit.time}</h4>
                        <p><strong>Purpose:</strong> ${visit.purpose}</p>
                        <p><strong>Status:</strong> <span class="status-badge ${visit.status === 'Completed' ? 'status-completed' : 'status-scheduled'}">${visit.status}</span></p>
                        <div class="no-print" style="margin-top: 10px;">
                            <button class="btn-action btn-edit" onclick="editRecord('visit', ${visit.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-edit"></i> Edit</button>
                            <button class="btn-action btn-delete" onclick="deleteRecord('visit', ${visit.id})" style="padding: 4px 8px; font-size: 12px;"><i class="fas fa-trash"></i> Delete</button>
                        </div>
                    </div>
                </div>
            `;
            scheduledVisitsDiv.innerHTML += visitCard;
        });
    }
}

// Load profit analysis
function loadProfitAnalysis() {
    // Already handled in loadAllSales
}

// Populate farmer dropdowns in modals
function populateFarmerDropdowns() {
    const visitFarmerSelect = document.getElementById('visitFarmer');
    const reportFarmerSelect = document.getElementById('reportFarmer');
    
    if (visitFarmerSelect) {
        visitFarmerSelect.innerHTML = '<option value="">Select a farmer</option>';
        sampleData.farmers.forEach(farmer => {
            if (farmer.status === 'Active') {
                visitFarmerSelect.innerHTML += `<option value="${farmer.id}">${farmer.name} - ${farmer.location}</option>`;
            }
        });
    }
    
    if (reportFarmerSelect) {
        reportFarmerSelect.innerHTML = '<option value="all">All Farmers</option>';
        sampleData.farmers.forEach(farmer => {
            if (farmer.status === 'Active') {
                reportFarmerSelect.innerHTML += `<option value="${farmer.id}">${farmer.name}</option>`;
            }
        });
    }
}

// Handle adding a new farmer
function handleAddFarmer(e) {
    e.preventDefault();
    
    const name = document.getElementById('newFarmerName').value;
    const email = document.getElementById('newFarmerEmail').value;
    const phone = document.getElementById('newFarmerPhone').value;
    const location = document.getElementById('newFarmerLocation').value;
    const farms = document.getElementById('newFarmerFarms').value;
    
    // Create new farmer
    const newFarmer = {
        id: sampleData.farmers.length + 1,
        name,
        email,
        phone,
        location,
        farms,
        status: "Active"
    };
    
    sampleData.farmers.push(newFarmer);
    
    // Update display
    loadFarmersData();
    populateFarmerDropdowns();
    
    // Reset form and close modal
    document.getElementById('addFarmerForm').reset();
    closeModal('addFarmerModal');
    
    alert(`Farmer ${name} has been added successfully!`);
}

// Handle scheduling a farm visit
function handleScheduleVisit(e) {
    e.preventDefault();
    
    const farmerId = document.getElementById('visitFarmer').value;
    const date = document.getElementById('visitDate').value;
    const time = document.getElementById('visitTime').value;
    const purpose = document.getElementById('visitPurpose').value;
    const notes = document.getElementById('visitNotes').value;
    
    // Find farmer name
    const farmer = sampleData.farmers.find(f => f.id == farmerId);
    if (!farmer) {
        alert('Please select a valid farmer');
        return;
    }
    
    // Create new visit
    const newVisit = {
        id: sampleData.scheduledVisits.length + 1,
        farmer: farmer.name,
        date: formatDate(date),
        time: formatTime(time),
        purpose: document.getElementById('visitPurpose').options[document.getElementById('visitPurpose').selectedIndex].text,
        status: "Scheduled",
        notes
    };
    
    sampleData.scheduledVisits.push(newVisit);
    
    // Update display
    loadScheduledVisits();
    updateAgronomistStats();
    
    // Reset form and close modal
    document.getElementById('scheduleVisitForm').reset();
    closeModal('scheduleVisitModal');
    
    alert(`Farm visit scheduled for ${farmer.name} on ${newVisit.date} at ${newVisit.time}`);
}

// Handle new order request
function handleNewOrder(e) {
    e.preventDefault();
    
    const item = document.getElementById('orderItem').value;
    const quantity = document.getElementById('orderQuantity').value;
    const unit = document.getElementById('orderUnit').value;
    const urgency = document.getElementById('orderUrgency').value;
    const notes = document.getElementById('orderNotes').value;
    
    const farmerName = currentUser ? currentUser.name : "John Agritech";
    
    // Create new order
    const newOrder = {
        id: sampleData.farmOrders.length + 1,
        orderId: `ORD-00${sampleData.farmOrders.length + 1}`,
        farmer: farmerName,
        item: document.getElementById('orderItem').options[document.getElementById('orderItem').selectedIndex].text,
        quantity: `${quantity} ${unit}`,
        date: new Date().toISOString().split('T')[0],
        status: "Pending",
        urgency,
        notes
    };
    
    sampleData.farmOrders.push(newOrder);
    
    // Update display
    loadFarmerOrders();
    updateAgronomistStats();
    
    // Reset form and close modal
    document.getElementById('newOrderForm').reset();
    closeModal('newOrderModal');
    
    alert(`Order request submitted successfully! Order ID: ${newOrder.orderId}`);
}

// Handle generating a report
function handleGenerateReport(e) {
    e.preventDefault();
    
    const type = document.getElementById('reportType').value;
    const farmerId = document.getElementById('reportFarmer').value;
    const dateFrom = document.getElementById('reportDateFrom').value;
    const dateTo = document.getElementById('reportDateTo').value;
    const title = document.getElementById('reportTitle').value;
    const summary = document.getElementById('reportSummary').value;
    const recommendations = document.getElementById('reportRecommendations').value;
    
    // Find farmer name
    let farmerName = "All Farmers";
    if (farmerId !== "all") {
        const farmer = sampleData.farmers.find(f => f.id == farmerId);
        if (farmer) farmerName = farmer.name;
    }
    
    // Create new report
    const newReport = {
        id: sampleData.reports.length + 1,
        reportId: `REP-00${sampleData.reports.length + 1}`,
        type: document.getElementById('reportType').options[document.getElementById('reportType').selectedIndex].text,
        farmer: farmerName,
        date: new Date().toISOString().split('T')[0],
        summary,
        status: "Published",
        period: `${formatDate(dateFrom)} to ${formatDate(dateTo)}`,
        recommendations,
        title
    };
    
    sampleData.reports.push(newReport);
    
    // Update display and stats
    loadReports();
    updateAgronomistStats();
    
    // Reset form and close modal
    document.getElementById('generateReportForm').reset();
    closeModal('generateReportModal');
    
    alert(`Report "${title}" generated successfully!`);
}

// Handle adding a sale
function handleAddSale(e) {
    e.preventDefault();
    
    const crop = document.getElementById('saleCrop').value;
    const quantity = parseFloat(document.getElementById('saleQuantity').value);
    const unit = document.getElementById('saleUnit').value;
    const pricePerUnit = parseFloat(document.getElementById('salePricePerUnit').value);
    const costPrice = parseFloat(document.getElementById('saleCostPrice').value);
    const startingPrice = parseFloat(document.getElementById('saleStartingPrice').value);
    const date = document.getElementById('saleDate').value;
    const buyer = document.getElementById('saleBuyer').value;
    const notes = document.getElementById('saleNotes').value;
    
    const farmerName = currentUser ? currentUser.name : "John Agritech";
    
    // Calculate totals
    const total = quantity * pricePerUnit;
    const profit = quantity * (pricePerUnit - costPrice);
    
    // Create new sale
    const newSale = {
        id: sampleData.sales.length + 1,
        farmer: farmerName,
        crop,
        quantity,
        unit,
        pricePerUnit,
        costPrice,
        startingPrice,
        date,
        buyer,
        notes,
        total,
        profit
    };
    
    sampleData.sales.push(newSale);
    
    // Update displays
    loadFarmerSales();
    loadAllSales();
    updateAgronomistStats();
    
    // Reset form and close modal
    document.getElementById('addSaleForm').reset();
    closeModal('addSaleModal');
    
    alert(`Sale recorded successfully! Total: $${total.toFixed(2)}, Profit: $${profit.toFixed(2)}`);
}

// Edit record function
function editRecord(type, id) {
    let record, formContent, modalTitle;
    
    switch(type) {
        case 'farmer':
            record = sampleData.farmers.find(f => f.id === id);
            modalTitle = "Edit Farmer";
            formContent = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="editName">Full Name</label>
                        <input type="text" id="editName" value="${record.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editEmail">Email</label>
                        <input type="email" id="editEmail" value="${record.email}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editPhone">Phone</label>
                        <input type="tel" id="editPhone" value="${record.phone}" required>
                    </div>
                    <div class="form-group">
                        <label for="editLocation">Location</label>
                        <input type="text" id="editLocation" value="${record.location}" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="editFarms">Farm Details</label>
                    <textarea id="editFarms" rows="3" required>${record.farms}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="editStatus">Status</label>
                    <select id="editStatus" required>
                        <option value="Active" ${record.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Inactive" ${record.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            `;
            break;
            
        case 'order':
            record = sampleData.farmOrders.find(o => o.id === id);
            modalTitle = "Edit Order";
            formContent = `
                <div class="form-group">
                    <label for="editItem">Item</label>
                    <input type="text" id="editItem" value="${record.item}" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editQuantity">Quantity</label>
                        <input type="text" id="editQuantity" value="${record.quantity.split(' ')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label for="editUnit">Unit</label>
                        <input type="text" id="editUnit" value="${record.quantity.split(' ')[1]}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editDate">Date</label>
                        <input type="date" id="editDate" value="${record.date}" required>
                    </div>
                    <div class="form-group">
                        <label for="editStatus">Status</label>
                        <select id="editStatus" required>
                            <option value="Pending" ${record.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Processing" ${record.status === 'Processing' ? 'selected' : ''}>Processing</option>
                            <option value="Completed" ${record.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="editNotes">Notes</label>
                    <textarea id="editNotes" rows="3">${record.notes || ''}</textarea>
                </div>
            `;
            break;
            
        case 'report':
            record = sampleData.reports.find(r => r.id === id);
            modalTitle = "Edit Report";
            formContent = `
                <div class="form-group">
                    <label for="editType">Report Type</label>
                    <input type="text" id="editType" value="${record.type}" required>
                </div>
                
                <div class="form-group">
                    <label for="editSummary">Summary</label>
                    <textarea id="editSummary" rows="4" required>${record.summary}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="editRecommendations">Recommendations</label>
                    <textarea id="editRecommendations" rows="4" required>${record.recommendations}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editDate">Date</label>
                        <input type="date" id="editDate" value="${record.date}" required>
                    </div>
                    <div class="form-group">
                        <label for="editStatus">Status</label>
                        <select id="editStatus" required>
                            <option value="Pending" ${record.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Completed" ${record.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Published" ${record.status === 'Published' ? 'selected' : ''}>Published</option>
                        </select>
                    </div>
                </div>
            `;
            break;
            
        case 'sale':
            record = sampleData.sales.find(s => s.id === id);
            modalTitle = "Edit Sale";
            formContent = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="editCrop">Crop</label>
                        <input type="text" id="editCrop" value="${record.crop}" required>
                    </div>
                    <div class="form-group">
                        <label for="editQuantity">Quantity</label>
                        <input type="number" id="editQuantity" value="${record.quantity}" step="0.01" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editUnit">Unit</label>
                        <input type="text" id="editUnit" value="${record.unit}" required>
                    </div>
                    <div class="form-group">
                        <label for="editPricePerUnit">Price per Unit ($)</label>
                        <input type="number" id="editPricePerUnit" value="${record.pricePerUnit}" step="0.01" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editCostPrice">Cost Price per Unit ($)</label>
                        <input type="number" id="editCostPrice" value="${record.costPrice}" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="editStartingPrice">Starting Price per Unit ($)</label>
                        <input type="number" id="editStartingPrice" value="${record.startingPrice}" step="0.01" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editDate">Date</label>
                        <input type="date" id="editDate" value="${record.date}" required>
                    </div>
                    <div class="form-group">
                        <label for="editBuyer">Buyer</label>
                        <input type="text" id="editBuyer" value="${record.buyer || ''}">
                    </div>
                </div>
            `;
            break;
            
        case 'visit':
            record = sampleData.scheduledVisits.find(v => v.id === id);
            modalTitle = "Edit Visit";
            formContent = `
                <div class="form-group">
                    <label for="editFarmer">Farmer</label>
                    <input type="text" id="editFarmer" value="${record.farmer}" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editDate">Date</label>
                        <input type="date" id="editDate" value="${record.date}" required>
                    </div>
                    <div class="form-group">
                        <label for="editTime">Time</label>
                        <input type="time" id="editTime" value="${record.time.replace(' AM', '').replace(' PM', '')}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editPurpose">Purpose</label>
                        <input type="text" id="editPurpose" value="${record.purpose}" required>
                    </div>
                    <div class="form-group">
                        <label for="editStatus">Status</label>
                        <select id="editStatus" required>
                            <option value="Scheduled" ${record.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                            <option value="Completed" ${record.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="editNotes">Notes</label>
                    <textarea id="editNotes" rows="3">${record.notes || ''}</textarea>
                </div>
            `;
            break;
    }
    
    // Set up modal
    document.getElementById('editModalTitle').textContent = modalTitle;
    document.getElementById('editFormContent').innerHTML = formContent;
    document.getElementById('editRecordId').value = id;
    document.getElementById('editRecordType').value = type;
    
    // Open modal
    openModal('editRecordModal');
}

// Handle editing a record
function handleEditRecord(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editRecordId').value);
    const type = document.getElementById('editRecordType').value;
    
    let record;
    switch(type) {
        case 'farmer':
            record = sampleData.farmers.find(f => f.id === id);
            if (record) {
                record.name = document.getElementById('editName').value;
                record.email = document.getElementById('editEmail').value;
                record.phone = document.getElementById('editPhone').value;
                record.location = document.getElementById('editLocation').value;
                record.farms = document.getElementById('editFarms').value;
                record.status = document.getElementById('editStatus').value;
            }
            break;
            
        case 'order':
            record = sampleData.farmOrders.find(o => o.id === id);
            if (record) {
                record.item = document.getElementById('editItem').value;
                record.quantity = `${document.getElementById('editQuantity').value} ${document.getElementById('editUnit').value}`;
                record.date = document.getElementById('editDate').value;
                record.status = document.getElementById('editStatus').value;
                record.notes = document.getElementById('editNotes').value;
            }
            break;
            
        case 'report':
            record = sampleData.reports.find(r => r.id === id);
            if (record) {
                record.type = document.getElementById('editType').value;
                record.summary = document.getElementById('editSummary').value;
                record.recommendations = document.getElementById('editRecommendations').value;
                record.date = document.getElementById('editDate').value;
                record.status = document.getElementById('editStatus').value;
            }
            break;
            
        case 'sale':
            record = sampleData.sales.find(s => s.id === id);
            if (record) {
                record.crop = document.getElementById('editCrop').value;
                record.quantity = parseFloat(document.getElementById('editQuantity').value);
                record.unit = document.getElementById('editUnit').value;
                record.pricePerUnit = parseFloat(document.getElementById('editPricePerUnit').value);
                record.costPrice = parseFloat(document.getElementById('editCostPrice').value);
                record.startingPrice = parseFloat(document.getElementById('editStartingPrice').value);
                record.date = document.getElementById('editDate').value;
                record.buyer = document.getElementById('editBuyer').value;
                record.total = record.quantity * record.pricePerUnit;
                record.profit = record.quantity * (record.pricePerUnit - record.costPrice);
            }
            break;
            
        case 'visit':
            record = sampleData.scheduledVisits.find(v => v.id === id);
            if (record) {
                record.farmer = document.getElementById('editFarmer').value;
                record.date = document.getElementById('editDate').value;
                record.time = formatTime(document.getElementById('editTime').value);
                record.purpose = document.getElementById('editPurpose').value;
                record.status = document.getElementById('editStatus').value;
                record.notes = document.getElementById('editNotes').value;
            }
            break;
    }
    
    // Update displays
    loadFarmersData();
    loadFarmerOrders();
    loadReports();
    loadFarmerSales();
    loadAllSales();
    loadScheduledVisits();
    updateAgronomistStats();
    
    // Close modal
    closeModal('editRecordModal');
    alert('Record updated successfully!');
}

// Delete record function (direct)
function deleteRecord(type, id) {
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
        return;
    }
    
    let array;
    switch(type) {
        case 'farmer': array = sampleData.farmers; break;
        case 'order': array = sampleData.farmOrders; break;
        case 'report': array = sampleData.reports; break;
        case 'sale': array = sampleData.sales; break;
        case 'visit': array = sampleData.scheduledVisits; break;
    }
    
    const index = array.findIndex(item => item.id === id);
    if (index !== -1) {
        array.splice(index, 1);
        
        // Update displays
        loadFarmersData();
        loadFarmerOrders();
        loadReports();
        loadFarmerSales();
        loadAllSales();
        loadScheduledVisits();
        updateAgronomistStats();
        
        alert('Record deleted successfully!');
    }
}

// Handle delete record from modal
function handleDeleteRecord() {
    const id = parseInt(document.getElementById('editRecordId').value);
    const type = document.getElementById('editRecordType').value;
    
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
        return;
    }
    
    let array;
    switch(type) {
        case 'farmer': array = sampleData.farmers; break;
        case 'order': array = sampleData.farmOrders; break;
        case 'report': array = sampleData.reports; break;
        case 'sale': array = sampleData.sales; break;
        case 'visit': array = sampleData.scheduledVisits; break;
    }
    
    const index = array.findIndex(item => item.id === id);
    if (index !== -1) {
        array.splice(index, 1);
        
        // Update displays
        loadFarmersData();
        loadFarmerOrders();
        loadReports();
        loadFarmerSales();
        loadAllSales();
        loadScheduledVisits();
        updateAgronomistStats();
        
        // Close modal
        closeModal('editRecordModal');
        alert('Record deleted successfully!');
    }
}

// Update farmer profile
function updateFarmerProfile() {
    const name = document.getElementById('farmerName').value;
    const email = document.getElementById('farmerEmail').value;
    const phone = document.getElementById('farmerPhone').value;
    const location = document.getElementById('farmerLocation').value;
    const farms = document.getElementById('farmerFarms').value;
    
    // Update user info in header
    document.querySelector('#farmerDashboard .user-avatar').textContent = name.split(' ').map(n => n[0]).join('');
    document.querySelector('#farmerDashboard .user-info h4').textContent = name;
    
    alert('Profile updated successfully!');
}

// Update agronomist profile and password
function updateAgronomistProfile() {
    const name = document.getElementById('agronomistName').value;
    const email = document.getElementById('agronomistEmail').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Update user info in header
    document.querySelector('#agronomistDashboard .user-avatar').textContent = name.split(' ').map(n => n[0]).join('');
    document.querySelector('#agronomistDashboard .user-info h4').textContent = name;
    
    // Change password if all fields are filled
    if (currentPassword && newPassword && confirmPassword) {
        // Check if current password matches any agronomist password
        const isValidCurrent = sampleData.validCredentials.agronomist.some(
            cred => cred.password === currentPassword
        );
        
        if (!isValidCurrent) {
            alert('Current password is incorrect!');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        
        // Update password for all agronomist accounts (demo)
        sampleData.validCredentials.agronomist.forEach(cred => {
            cred.password = newPassword;
        });
        
        alert('Password changed successfully!');
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    } else if (currentPassword || newPassword || confirmPassword) {
        alert('Please fill all password fields to change password');
        return;
    }
    
    alert('Profile updated successfully!');
}

// Reset password function
function resetPassword() {
    const newPassword = prompt("Enter new password for agronomist account:");
    if (newPassword && newPassword.length >= 6) {
        // Update password for all agronomist accounts (demo)
        sampleData.validCredentials.agronomist.forEach(cred => {
            cred.password = newPassword;
        });
        alert('Password reset successfully! New password: ' + newPassword);
    } else if (newPassword) {
        alert('Password must be at least 6 characters long');
    }
}

// DOWNLOAD FUNCTIONS
function downloadFarmersList() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Farmer Name,Email,Phone,Location,Farms,Status\n";
    
    sampleData.farmers.forEach(farmer => {
        csvContent += `"${farmer.name}","${farmer.email}","${farmer.phone}","${farmer.location}","${farmer.farms}","${farmer.status}"\n`;
    });
    
    downloadCSV(csvContent, 'farmers_list');
}

function downloadFarmerOrders() {
    const farmerName = currentUser ? currentUser.name : "John Agritech";
    const farmerOrders = sampleData.farmOrders.filter(order => order.farmer === farmerName);
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Item,Quantity,Date,Status,Notes\n";
    
    farmerOrders.forEach(order => {
        csvContent += `"${order.orderId}","${order.item}","${order.quantity}","${order.date}","${order.status}","${order.notes || ''}"\n`;
    });
    
    downloadCSV(csvContent, 'farmer_orders');
}

function downloadFarmerReports() {
    const farmerName = currentUser ? currentUser.name : "John Agritech";
    const filteredReports = sampleData.reports.filter(report => 
        report.farmer === farmerName || report.farmer === "All Farmers"
    );
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Report ID,Type,Farmer,Date,Summary,Status,Recommendations\n";
    
    filteredReports.forEach(report => {
        csvContent += `"${report.reportId}","${report.type}","${report.farmer}","${report.date}","${report.summary}","${report.status}","${report.recommendations}"\n`;
    });
    
    downloadCSV(csvContent, 'farmer_reports');
}

function downloadAllReports() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Report ID,Type,Farmer,Date,Summary,Status,Recommendations,Period,Title\n";
    
    sampleData.reports.forEach(report => {
        csvContent += `"${report.reportId}","${report.type}","${report.farmer}","${report.date}","${report.summary}","${report.status}","${report.recommendations}","${report.period || 'N/A'}","${report.title || 'N/A'}"\n`;
    });
    
    downloadCSV(csvContent, 'all_reports');
}

function downloadSalesProfitSheet() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Farmer,Crop,Quantity,Unit,Price/Unit,Cost/Unit,Starting Price/Unit,Total,Profit,Buyer\n";
    
    sampleData.sales.forEach(sale => {
        csvContent += `"${sale.date}","${sale.farmer}","${sale.crop}","${sale.quantity}","${sale.unit}","${sale.pricePerUnit}","${sale.costPrice}","${sale.startingPrice}","${sale.total}","${sale.profit}","${sale.buyer || ''}"\n`;
    });
    
    downloadCSV(csvContent, 'sales_profit_sheet');
}

function downloadProfitSheet() {
    const farmerName = currentUser ? currentUser.name : "John Agritech";
    const farmerSales = sampleData.sales.filter(sale => sale.farmer === farmerName);
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Crop,Quantity,Unit,Price/Unit,Cost/Unit,Starting Price/Unit,Total,Profit,Buyer\n";
    
    farmerSales.forEach(sale => {
        csvContent += `"${sale.date}","${sale.crop}","${sale.quantity}","${sale.unit}","${sale.pricePerUnit}","${sale.costPrice}","${sale.startingPrice}","${sale.total}","${sale.profit}","${sale.buyer || ''}"\n`;
    });
    
    downloadCSV(csvContent, 'profit_sheet');
}

function downloadAllSales() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Farmer,Crop,Quantity,Unit,Price/Unit,Cost/Unit,Starting Price/Unit,Total,Profit,Buyer\n";
    
    sampleData.sales.forEach(sale => {
        csvContent += `"${sale.date}","${sale.farmer}","${sale.crop}","${sale.quantity}","${sale.unit}","${sale.pricePerUnit}","${sale.costPrice}","${sale.startingPrice}","${sale.total}","${sale.profit}","${sale.buyer || ''}"\n`;
    });
    
    downloadCSV(csvContent, 'all_sales');
}

function downloadCSV(csvContent, filename) {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`${filename} downloaded as CSV!`);
}

// PRINT FUNCTIONS
function printFarmersRecords() {
    const printContent = `
        <html>
        <head>
            <title>Farmers Records - Aaron Agronomy</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2E7D32; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f5f5f5; }
                .header { text-align: center; margin-bottom: 30px; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Aaron Agronomy</h1>
                <h2>Farmers Management Records</h2>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Farmer Name</th>
                        <th>Location</th>
                        <th>Contact</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${sampleData.farmers.map(farmer => `
                        <tr>
                            <td>${farmer.name}</td>
                            <td>${farmer.location}</td>
                            <td>${farmer.phone}</td>
                            <td>${farmer.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Total Farmers: ${sampleData.farmers.length} | Active: ${sampleData.farmers.filter(f => f.status === 'Active').length}</p>
                <p>&copy; ${new Date().getFullYear()} Aaron Agronomy System</p>
            </div>
        </body>
        </html>
    `;
    
    printDocument(printContent, 'Farmers Records');
}

function printFarmerReports() {
    const farmerName = currentUser ? currentUser.name : "John Agritech";
    const filteredReports = sampleData.reports.filter(report => 
        report.farmer === farmerName || report.farmer === "All Farmers"
    );
    
    const printContent = `
        <html>
        <head>
            <title>Agronomist Reports - Aaron Agronomy</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2E7D32; }
                .report { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                .report-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .report-title { font-weight: bold; color: #2E7D32; }
                .report-date { color: #666; }
                .header { text-align: center; margin-bottom: 30px; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Aaron Agronomy</h1>
                <h2>Agronomist Reports for ${farmerName}</h2>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${filteredReports.map(report => `
                <div class="report">
                    <div class="report-header">
                        <div class="report-title">${report.type}</div>
                        <div class="report-date">${report.date}</div>
                    </div>
                    <p><strong>Summary:</strong> ${report.summary}</p>
                    <p><strong>Recommendations:</strong> ${report.recommendations}</p>
                    <p><strong>Status:</strong> ${report.status}</p>
                </div>
            `).join('')}
            
            <div class="footer">
                <p>Total Reports: ${filteredReports.length}</p>
                <p>&copy; ${new Date().getFullYear()} Aaron Agronomy System</p>
            </div>
        </body>
        </html>
    `;
    
    printDocument(printContent, 'Farmer Reports');
}

function printDocument(content, title) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
    
    alert(`Printing ${title}...`);
}

// Helper functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Load sales data initially
function loadSalesData() {
    // Already handled in other functions
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);