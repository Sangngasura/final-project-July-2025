// ====================================================
// app.js - Full AgriMarket Implementation
// ====================================================

// ---------- Helpers & Storage ----------
function getProducts(){ return JSON.parse(localStorage.getItem('products')||'[]'); }
function saveProducts(p){ localStorage.setItem('products', JSON.stringify(p)); }
function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
function getUsers(){ return JSON.parse(localStorage.getItem('users')||'[]'); }
function saveUsers(u){ localStorage.setItem('users', JSON.stringify(u)); }
function getCurrentUser(){ return JSON.parse(localStorage.getItem('currentUser')||'null'); }
function setCurrentUser(u){ localStorage.setItem('currentUser', JSON.stringify(u)); }
function getOrders(){ return JSON.parse(localStorage.getItem('orders')||'[]'); }
function saveOrders(o){ localStorage.setItem('orders', JSON.stringify(o)); }
function getPending(){ return JSON.parse(localStorage.getItem('pendingProducts')||'[]'); }
function savePending(p){ localStorage.setItem('pendingProducts', JSON.stringify(p)); }

// ---------- Demo data init ----------
(function initDemo(){
  if(!localStorage.getItem('products')){
    saveProducts([
      { id:'p1', title:'Maize', price:100, qty:50, unit:'kg', image:'https://images.pexels.com/photos/4937590/pexels-photo-4937590.jpeg' },
      { id:'p2', title:'Wheat', price:180, qty:40, unit:'kg', image:'https://images.pexels.com/photos/54084/wheat-grain-agriculture-seed-54084.jpeg' },
      { id:'p3', title:'Tomatoes', price:90, qty:60, unit:'crate', image:'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg' },
      { id:'p4', title:'Peas', price:150, qty:30, unit:'kg', image:'https://images.pexels.com/photos/255469/pexels-photo-255469.jpeg' },
      { id:'p5', title:'Beans', price:220, qty:25, unit:'kg', image:'https://images.pexels.com/photos/2695436/pexels-photo-2695436.jpeg' },
      { id:'p6', title:'Kamande', price:230, qty:20, unit:'kg', image:'https://images.pexels.com/photos/14965274/pexels-photo-14965274.jpeg' },
      { id:'p7', title:'Potatoes', price:120, qty:50, unit:'bag', image:'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg' },
      { id:'p8', title:'Yellow Beans', price:200, qty:35, unit:'kg', image:'https://images.pexels.com/photos/2695436/pexels-photo-2695436.jpeg' },
      { id:'p9', title:'Beans', price:210, qty:30, unit:'kg', image:'https://images.pexels.com/photos/2695436/pexels-photo-2695436.jpeg' },
      { id:'p10', title:'Peanuts', price:300, qty:25, unit:'kg', image:'https://images.pexels.com/photos/32920574/pexels-photo-32920574.jpeg' }
    ]);
  }
  if(!localStorage.getItem('users')) saveUsers([]);
  if(!localStorage.getItem('orders')) saveOrders([]);
  if(!localStorage.getItem('pendingProducts')) savePending([]);
  if(!localStorage.getItem('drivers')) localStorage.setItem('drivers', JSON.stringify([]));
})();

// ---------- Render user nav ----------
function renderUserNav(){
  const el = document.getElementById('userNav');
  if(!el) return;
  const user = getCurrentUser();
  if(user){
    el.innerHTML = `<a href="account.html" class="btn btn-outline-primary me-2">${user.name || user.email}</a>
                    <button class="btn btn-danger" onclick="logout()">Logout</button>`;
  } else {
    el.innerHTML = `<a href="login.html" class="btn btn-outline-success me-2">Login</a>
                    <a href="signup.html" class="btn btn-success">Sign Up</a>`;
  }
}

// ---------- Render products ----------
function renderProducts(){
  const list = document.getElementById('productList');
  if(!list) return;
  const prods = getProducts();
  list.innerHTML = prods.map(p => `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card product-card h-100 shadow-sm">
        <img src="${p.image}" alt="${p.title}" class="card-img-top" style="height:180px;object-fit:cover;">
        <div class="card-body d-flex flex-column">
          <h6 class="fw-bold">${p.title}</h6>
          <div class="small text-muted mb-2">KES ${p.price}/${p.unit} • ${p.qty} ${p.unit}s left</div>
          <div class="input-group input-group-sm mb-2">
            <span class="input-group-text">Qty</span>
            <input id="qty_${p.id}" type="number" min="1" max="${p.qty}" value="1" class="form-control">
            <select id="unit_${p.id}" class="form-select" style="max-width:110px;">
              <option selected>${p.unit}</option>
            </select>
          </div>
          <button class="btn btn-success mt-auto" onclick="handleAddToCart('${p.id}')" ${p.qty<=0?'disabled':''}>
            ${p.qty<=0?'Out of Stock':'Add to Cart'}
          </button>
        </div>
      </div>
    </div>`).join('');
}

// ---------- Cart utilities ----------
function renderCart(){
  const body = document.getElementById('cartPageBody');
  if(!body) return;
  const cart = getCart();
  const prods = getProducts();
  if(cart.length === 0){ body.innerHTML = '<p class="text-muted text-center">Your cart is empty</p>'; return; }
  body.innerHTML = cart.map(ci=>{
    const p = prods.find(pp=>pp.id===ci.id) || { title:'Item', image:'', unit:'' };
    return `<div class="d-flex align-items-center border-bottom pb-2 mb-2">
      <img src="${p.image}" width="60" height="60" class="rounded me-2" style="object-fit:cover">
      <div class="flex-grow-1">
        <div>${p.title}</div>
        <small>${ci.qty} ${p.unit}(s) • KES ${p.qty * p.price}</small>
        <div class="input-group input-group-sm mt-1" style="max-width:140px;">
          <button class="btn btn-outline-secondary" onclick="updateQty('${p.id}',-1)">-</button>
          <input class="form-control text-center" value="${ci.qty}" readonly>
          <button class="btn btn-outline-secondary" onclick="updateQty('${p.id}',1)">+</button>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart('${p.id}')"><i class="bi bi-trash"></i></button>
    </div>`;
  }).join('');
  renderCartBadge();
}

// ---------- cart badge ----------
function renderCartBadge(){
  const badge = document.getElementById('cartCount');
  if(!badge) return;
  const cart = getCart();
  let total = 0; cart.forEach(c=>total += c.qty);
  badge.textContent = total;
}

// ---------- cart operations ----------
function handleAddToCart(id){
  const user = getCurrentUser();
  if(!user){ alert('Please login to add items to cart'); window.location.href='login.html'; return; }

  const prods = getProducts();
  const p = prods.find(x=>x.id===id);
  if(!p) return alert('Item not found');
  const qtyEl = document.getElementById(`qty_${id}`);
  const qty = Math.max(1, parseInt(qtyEl?.value || 1));
  if(qty > p.qty) return alert('Not enough stock');

  p.qty -= qty;
  saveProducts(prods);

  let cart = getCart();
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);

  renderProducts();
  renderCart();
  renderCartBadge();
  openCart();
}

function updateQty(id, delta){
  const cart = getCart();
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  const prods = getProducts();
  const prod = prods.find(p=>p.id===id);
  if(delta === -1 && item.qty > 1){
    item.qty -= 1; prod.qty += 1;
  } else if(delta === 1 && prod.qty > 0){
    item.qty += 1; prod.qty -= 1;
  }
  saveCart(cart); saveProducts(prods); renderCart(); renderProducts(); renderCartBadge();
}

function removeFromCart(id){
  let cart = getCart();
  const item = cart.find(c=>c.id===id);
  if(item){
    const prods = getProducts();
    const prod = prods.find(p=>p.id===id);
    if(prod) prod.qty += item.qty;
  }
  cart = cart.filter(c=>c.id!==id);
  saveCart(cart); saveProducts(getProducts());
  renderCart(); renderProducts(); renderCartBadge();
}

// ---------- Cart slide ----------
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
if(cartBtn) cartBtn.addEventListener('click', ()=>{ cartSidebar.classList.add('open'); cartOverlay.classList.add('show'); renderCart(); populateAddressSelect(); });
if(closeCartBtn) closeCartBtn.addEventListener('click', ()=>{ cartSidebar.classList.remove('open'); cartOverlay.classList.remove('show'); });
if(cartOverlay) cartOverlay.addEventListener('click', ()=>{ cartSidebar.classList.remove('open'); cartOverlay.classList.remove('show'); });

// ---------- Address handling in cart ----------
function populateAddressSelect(){
  const sel = document.getElementById('addressSelect');
  if(!sel) return;
  const user = getCurrentUser();
  if(!user){ sel.innerHTML = '<option value="">Please login</option>'; return; }
  const users = getUsers();
  const u = users.find(x=>x.email === user.email);
  sel.innerHTML = '';
  if(!u || !u.addresses || u.addresses.length === 0){
    sel.innerHTML = '<option value="new">+ Add new address</option>';
    document.getElementById('newAddressForm').classList.remove('d-none');
  } else {
    sel.innerHTML = u.addresses.map((a,i)=>`<option value="${i}">${a.name}, ${a.city} — ${a.phone}</option>`).join('') + '<option value="new">+ Add new address</option>';
    document.getElementById('newAddressForm').classList.add('d-none');
  }
  sel.onchange = function(){
    if(sel.value === 'new') document.getElementById('newAddressForm').classList.remove('d-none');
    else document.getElementById('newAddressForm').classList.add('d-none');
  };
}

// ---------- Confirm checkout ----------
document.getElementById('confirmCheckout')?.addEventListener('click', ()=>{
  const user = getCurrentUser();
  if(!user){ alert('Login required'); window.location.href='login.html'; return; }
  const users = getUsers(); const u = users.find(x=>x.email===user.email);

  const sel = document.getElementById('addressSelect').value;
  let addr = null;
  if(sel === 'new' || !sel){
    const name = document.getElementById('shipName').value.trim();
    const phone = document.getElementById('shipPhone').value.trim();
    const city = document.getElementById('shipCity').value.trim();
    const line = document.getElementById('shipAddress').value.trim();
    if(!name||!phone||!city||!line) return alert('Fill shipping details');
    addr = { name, phone, city, line };
    if(!u.addresses) u.addresses = []; u.addresses.push(addr);
    saveUsers(users); setCurrentUser(u);
  } else {
    addr = u.addresses[Number(sel)];
  }
  const pay = document.getElementById('payMethod').value;
  if(!pay) return alert('Choose payment');

  const cart = getCart();
  if(cart.length === 0) return alert('Cart is empty');

  // create order
  const orders = getOrders();
  const id = 'o' + Date.now();
  orders.push({ id, user: u.email, cart, address: addr, payment: pay, date: new Date().toLocaleString(), status: 'Pending' });
  saveOrders(orders);

  // clear cart
  localStorage.removeItem('cart');
  renderCart(); renderCartBadge();
  alert('Order placed. Admin will process.');
  cartSidebar.classList.remove('open'); cartOverlay.classList.remove('show');
});

// ---------- Post product (account) ----------
function postProduct(data){
  const pending = getPending();
  pending.push(data);
  savePending(pending);
}

// ---------- Admin operations ----------
window.approvePending = function(pendingId){
  let pending = getPending();
  const idx = pending.findIndex(p=>p.id===pendingId);
  if(idx === -1) return alert('Not found');
  const item = pending[idx];
  const products = getProducts();
  products.push({ id: 'p' + Date.now(), title: item.name, price: item.price, qty: item.qty, unit: item.unit, image: item.image || 'https://via.placeholder.com/200' });
  saveProducts(products);
  pending.splice(idx,1);
  savePending(pending);
  alert('Approved and added to marketplace');
  // refresh admin UI if open
  window.renderPendingAdmin?.(); window.renderMarketAdmin?.();
  renderProducts();
};

window.rejectPending = function(pendingId){
  let pending = getPending();
  pending = pending.filter(p=>p.id!==pendingId);
  savePending(pending);
  alert('Rejected');
  window.renderPendingAdmin?.();
};

window.editProduct = function(index){
  const products = getProducts();
  if(!products[index]) return alert('Product not found');
  const p = products[index];
  const title = prompt('Title', p.title);
  if(title === null) return;
  const price = prompt('Price', p.price);
  if(price === null) return;
  const qty = prompt('Quantity', p.qty);
  if(qty === null) return;
  const unit = prompt('Unit', p.unit || 'kg');
  if(unit === null) return;
  const image = prompt('Image URL', p.image || '');
  p.title = title; p.price = Number(price); p.qty = Number(qty); p.unit = unit; p.image = image;
  saveProducts(products);
  alert('Updated');
  window.renderMarketAdmin?.(); renderProducts();
};

window.deleteProduct = function(index){
  const products = getProducts();
  if(!products[index]) return alert('Not found');
  products.splice(index,1);
  saveProducts(products);
  alert('Deleted');
  window.renderMarketAdmin?.(); renderProducts();
};

// drivers and assigning to orders
window.assignDriverToOrder = function(orderIndex){
  const sel = document.getElementById('driverSelect_' + orderIndex);
  if(!sel) return alert('No driver select found');
  const driverIdx = sel.value;
  if(driverIdx === '') return alert('Choose driver');
  const drivers = JSON.parse(localStorage.getItem('drivers')||'[]');
  if(!drivers[driverIdx]) return alert('Driver not found');

  const orders = getOrders();
  if(orderIndex < 0 || orderIndex >= orders.length) return alert('Order not found');
  orders[orderIndex].driver = drivers[driverIdx];
  orders[orderIndex].status = 'In Transit';
  saveOrders(orders);
  alert('Driver assigned');
  window.renderOrdersAdmin?.();
};

// ---------- Driver helpers for admin page ----------
window.renderDriversAdmin = function(){
  // implemented in admin page script (just provided signature)
};

// ---------- Customer marking received ----------
window.markReceived = function(orderId){
  const orders = getOrders();
  const idx = orders.findIndex(o=>o.id===orderId);
  if(idx === -1) return alert('Order not found');
  orders[idx].status = 'Delivered';
  saveOrders(orders);
  alert('Marked received');
  // refresh account orders view if present
  document.querySelector('#orderList') && location.reload();
};

// ---------- Auth / Signup / Login ----------
function togglePass(id, btn){
  const input = document.getElementById(id);
  const icon = btn && btn.querySelector('i');
  if(!input) return;
  if(input.type === 'password'){ input.type = 'text'; if(icon) icon.classList.replace('bi-eye','bi-eye-slash'); }
  else { input.type = 'password'; if(icon) icon.classList.replace('bi-eye-slash','bi-eye'); }
}

// Signup form
const signupForm = document.getElementById('signupForm');
if(signupForm){
  signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    if(!name || !email || !phone || !password) return alert('Fill all fields');
    const users = getUsers();
    if(users.find(u=>u.email===email || u.phone===phone)) return alert('Email or phone already registered');
    const newUser = { name, email, phone, password, addresses:[] };
    users.push(newUser); saveUsers(users); setCurrentUser(newUser);
    alert('Account created'); window.location.href='index.html';
  });
}

// Login form
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const emailOrPhone = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value.trim();
    const users = getUsers();
    const found = users.find(u => (u.email===emailOrPhone || u.phone===emailOrPhone) && u.password === password);
    if(!found) return alert('Invalid credentials');
    setCurrentUser(found); alert('Logged in'); window.location.href='index.html';
  });
}

// ---------- Convenience on page load ----------
document.addEventListener('DOMContentLoaded', ()=>{
  renderUserNav();
  renderProducts();
  renderCartBadge();

  // If account page loaded, some setup is inlined in account.html script
  // If admin page loaded, admin.html handles its own wiring and calls app.js functions
});
