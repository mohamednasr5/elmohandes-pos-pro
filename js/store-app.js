// Store App - Dashboard and Store Management

// Currency formatter for Egyptian Pound
const currencyFormatter = new Intl.NumberFormat('ar-EG', {
  style: 'currency',
  currency: 'EGP',
  minimumFractionDigits: 2
});

// Initialize App
function initStoreApp() {
  checkUserAuth();
  loadDashboardData();
  setupEventListeners();
  displayUserInfo();
}

// Check user authentication
function checkUserAuth() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = '../login.html';
    return;
  }
}

// Display user information
function displayUserInfo() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      document.getElementById('userName').textContent = currentUser.storeName || 'متجري';
    }
  } catch (e) {
    console.error('Error displaying user info', e);
  }
}

// Load dashboard data
function loadDashboardData() {
  const salesData = JSON.parse(localStorage.getItem('sales_data') || '[]');
  const productsData = JSON.parse(localStorage.getItem('products') || '[]');
  const customersData = JSON.parse(localStorage.getItem('customers') || '[]');
  
  // Calculate today's sales
  const today = new Date().toDateString();
  const todaySales = salesData.filter(s => new Date(s.date).toDateString() === today).reduce((sum, s) => sum + (s.total || 0), 0);
  document.getElementById('todaySales').textContent = currencyFormatter.format(todaySales);
  
  // Display total customers
  document.getElementById('totalCustomers').textContent = customersData.length;
  
  // Calculate inventory value
  const inventoryValue = productsData.reduce((sum, p) => sum + ((p.quantity || 0) * (p.price || 0)), 0);
  document.getElementById('inventoryValue').textContent = currencyFormatter.format(inventoryValue);
  
  // Load sales table
  loadSalesTable(salesData);
  
  // Load products grid
  loadProductsGrid(productsData);
  
  // Load inventory table
  loadInventoryTable(productsData);
}

// Load sales table
function loadSalesTable(salesData) {
  const tbody = document.getElementById('salesTable');
  tbody.innerHTML = '';
  
  const limit = Math.min(salesData.length, 10);
  for (let i = salesData.length - limit; i < salesData.length; i++) {
    const sale = salesData[i];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sale.id || 'N/A'}</td>
      <td>${new Date(sale.date).toLocaleDateString('ar-EG')}</td>
      <td>${sale.items || 0} منتج</td>
      <td>${currencyFormatter.format(sale.total || 0)}</td>
    `;
    tbody.appendChild(row);
  }
  
  if (salesData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">لا توجد مبيعات</td></tr>';
  }
}

// Load products grid
function loadProductsGrid(productsData) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  
  productsData.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <h4>${product.name}</h4>
      <p>السعر: ${currencyFormatter.format(product.price || 0)}</p>
      <p>الكمية: ${product.quantity || 0}</p>
      <small>${product.barcode || 'N/A'}</small>
    `;
    grid.appendChild(card);
  });
  
  if (productsData.length === 0) {
    grid.innerHTML = '<p>لا توجد منتجات</p>';
  }
}

// Load inventory table
function loadInventoryTable(productsData) {
  const tbody = document.getElementById('inventoryTable');
  tbody.innerHTML = '';
  
  productsData.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.barcode || 'N/A'}</td>
      <td>${product.quantity || 0}</td>
      <td>${currencyFormatter.format((product.quantity || 0) * (product.price || 0))}</td>
    `;
    tbody.appendChild(row);
  });
  
  if (productsData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">المخزن فارغ</td></tr>';
  }
}

// Setup event listeners for navigation
function setupEventListeners() {
  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      showSection(section);
    });
  });
  
  // Logout button
  const logoutBtn = document.querySelector('.btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = '../login.html';
    });
  }
}

// Show/hide sections
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Show selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Update page title
    const titles = {
      'dashboard': 'لوحة التحكم',
      'sales': 'المبيعات',
      'products': 'المنتجات',
      'inventory': 'المخزن',
      'cashier': 'نقطة البيع'
    };
    document.getElementById('pageTitle').textContent = titles[sectionId] || 'لوحة التحكم';
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStoreApp);
} else {
  initStoreApp();
}
