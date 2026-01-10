// Products Manager - إدارة المنتجات والأصناف
const currencyFormatter = new Intl.NumberFormat('ar-EG', {
  style: 'currency',
  currency: 'EGP',
  minimumFractionDigits: 2
});

let categories = [];
let products = [];
let selectedCategory = null;

// Initialize
function initProductsManager() {
  loadData();
  displayCategories();
  displayProducts();
  displayUserInfo();
  setupLogout();
}

// Load data from localStorage
function loadData() {
  categories = JSON.parse(localStorage.getItem('categories') || '[]');
  products = JSON.parse(localStorage.getItem('products') || '[]');
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('categories', JSON.stringify(categories));
  localStorage.setItem('products', JSON.stringify(products));
}

// Add new category
function addCategory() {
  const name = document.getElementById('categoryName').value.trim();
  const desc = document.getElementById('categoryDesc').value.trim();
  
  if (!name) { alert('أدخل اسم الصنف'); return; }
  
  const newCategory = {
    id: Date.now(),
    name: name,
    description: desc,
    createdAt: new Date().toISOString()
  };
  
  categories.push(newCategory);
  saveData();
  
  document.getElementById('categoryName').value = '';
  document.getElementById('categoryDesc').value = '';
  
  displayCategories();
  updateCategorySelect();
  alert('تم إضافة الصنف بنجاح!');
}

// Display categories as tabs
function displayCategories() {
  const tabs = document.getElementById('categoryTabs');
  tabs.innerHTML = '';
  
  const allBtn = document.createElement('button');
  allBtn.className = 'category-tab' + (selectedCategory === null ? ' active' : '');
  allBtn.textContent = 'جميع المنتجات';
  allBtn.onclick = () => {
    selectedCategory = null;
    displayCategories();
    displayProducts();
  };
  tabs.appendChild(allBtn);
  
  categories.forEach(cat => {
    const tab = document.createElement('button');
    tab.className = 'category-tab' + (selectedCategory === cat.id ? ' active' : '');
    tab.textContent = cat.name;
    tab.onclick = () => {
      selectedCategory = cat.id;
      displayCategories();
      displayProducts();
    };
    tabs.appendChild(tab);
  });
}

// Update category select dropdown
function updateCategorySelect() {
  const select = document.getElementById('productCategory');
  select.innerHTML = '<option value="">اختر الصنف</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

// Add new product
function addProduct() {
  const name = document.getElementById('productName').value.trim();
  const categoryId = document.getElementById('productCategory').value;
  const price = parseFloat(document.getElementById('productPrice').value) || 0;
  const quantity = parseInt(document.getElementById('productQuantity').value) || 0;
  const barcode = document.getElementById('productBarcode').value.trim();
  const sku = document.getElementById('productSKU').value.trim();
  
  if (!name || !categoryId) {
    alert('أدخل اسم المنتج واختر الصنف');
    return;
  }
  
  const newProduct = {
    id: Date.now(),
    name: name,
    categoryId: parseInt(categoryId),
    price: price,
    quantity: quantity,
    barcode: barcode,
    sku: sku,
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  saveData();
  
  // Clear form
  document.getElementById('productName').value = '';
  document.getElementById('productCategory').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productQuantity').value = '0';
  document.getElementById('productBarcode').value = '';
  document.getElementById('productSKU').value = '';
  
  displayProducts();
  alert('تم إضافة المنتج بنجاح!');
}

// Display products
function displayProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  
  let filtered = products;
  if (selectedCategory !== null) {
    filtered = products.filter(p => p.categoryId === selectedCategory);
  }
  
  // Update title
  let categoryTitle = 'جميع المنتجات';
  if (selectedCategory !== null) {
    const cat = categories.find(c => c.id === selectedCategory);
    categoryTitle = cat ? cat.name : 'جميع المنتجات';
  }
  document.getElementById('categoryTitle').textContent = categoryTitle + ' (' + filtered.length + ')';
  
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: #718096;">لا توجد منتجات</p>';
    return;
  }
  
  filtered.forEach(product => {
    const item = document.createElement('div');
    item.className = 'product-item';
    
    const category = categories.find(c => c.id === product.categoryId);
    const categoryName = category ? category.name : 'غير محدد';
    
    item.innerHTML = `
      <h4>${product.name}</h4>
      <p><strong>الصنف:</strong> ${categoryName}</p>
      <p><strong>السعر:</strong> ${currencyFormatter.format(product.price)}</p>
      <p><strong>الكمية:</strong> ${product.quantity}</p>
      ${product.barcode ? '<p><strong>الباركود:</strong> ' + product.barcode + '</p>' : ''}
      ${product.sku ? '<p><strong>SKU:</strong> ' + product.sku + '</p>' : ''}
      <div class="product-actions">
        <button class="btn-small btn-edit" onclick="editProduct(${product.id})">تعديل</button>
        <button class="btn-small btn-delete" onclick="deleteProduct(${product.id})">حذف</button>
      </div>
    `;
    grid.appendChild(item);
  });
}

// Edit product
function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const newPrice = prompt('السعر الجديد:', product.price);
  const newQuantity = prompt('الكمية الجديدة:', product.quantity);
  
  if (newPrice !== null) product.price = parseFloat(newPrice);
  if (newQuantity !== null) product.quantity = parseInt(newQuantity);
  
  saveData();
  displayProducts();
  alert('تم تحديث المنتج بنجاح!');
}

// Delete product
function deleteProduct(productId) {
  if (confirm('هل تريد حذف هذا المنتج؟')) {
    products = products.filter(p => p.id !== productId);
    saveData();
    displayProducts();
    alert('تم حذف المنتج بنجاح!');
  }
}

// Display user info
function displayUserInfo() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      document.getElementById('userName').textContent = currentUser.storeName || 'متجري';
    }
  } catch (e) {}
}

// Setup logout
function setupLogout() {
  const logoutBtn = document.querySelector('.btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = '../login.html';
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductsManager);
} else {
  initProductsManager();
}
