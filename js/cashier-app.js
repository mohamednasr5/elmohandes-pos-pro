// Cashier App - POS System
class CashierApp {
  constructor() {
    this.cart = [];
    this.products = [];
    this.currentSale = null;
    this.init();
  }

  init() {
    this.loadSampleProducts();
    this.setupEventListeners();
    this.displayProducts();
  }

  loadSampleProducts() {
    this.products = [
      { id: 1, name: 'المنتج الأول', price: 50, stock: 100 },
      { id: 2, name: 'المنتج الثاني', price: 100, stock: 50 },
      { id: 3, name: 'المنتج الثالث', price: 75, stock: 80 }
    ];
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  displayProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    this.products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <h4>${product.name}</h4>
        <p>السعر: ${product.price} جنيه</p>
        <p>المتبقي: ${product.stock}</p>
        <button onclick="cashierApp.addToCart(${product.id})">إضافة للسلة</button>
      `;
      grid.appendChild(card);
    });
  }

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product || product.stock <= 0) { alert('المنتج غير متوفر'); return; }
    const existing = this.cart.find(p => p.id === productId);
    if (existing) existing.quantity++;
    else this.cart.push({ ...product, quantity: 1 });
    this.updateCart();
  }

  updateCart() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    this.cart.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td><input type="number" value="${item.quantity}" min="1" onchange="cashierApp.updateQuantity(${index}, this.value)"></td>
        <td>${item.price * item.quantity}</td>
        <td><button onclick="cashierApp.removeFromCart(${index})">حذف</button></td>
      `;
      tbody.appendChild(row);
    });
    this.calculateTotal();
  }

  calculateTotal() {
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.14;
    const final = total + tax;
    document.querySelectorAll('.stat-value').forEach((el, i) => {
      if (i === 0) el.textContent = total.toFixed(2) + '$';
      else if (i === 1) el.textContent = tax.toFixed(2) + '$';
      else if (i === 2) el.textContent = final.toFixed(2) + '$';
    });
  }

  updateQuantity(index, value) { this.cart[index].quantity = parseInt(value); this.updateCart(); }
  removeFromCart(index) { this.cart.splice(index, 1); this.updateCart(); }

  completeSale() {
    if (this.cart.length === 0) { alert('السلة فارغة'); return; }
    this.currentSale = { items: [...this.cart], timestamp: new Date(), total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) };
    localStorage.setItem('lastSale', JSON.stringify(this.currentSale));
    alert('تمت عملية البيع بنجاح');
    this.cart = [];
    this.displayProducts();
    this.updateCart();
  }
}

const cashierApp = new CashierApp();
console.log('Cashier App Loaded');
