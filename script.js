// Data produk
const products = [
  {
    id: 1,
    name: "Classic Choco",
    desc: "Buttery dough + pools of chocolate yang meleleh di mulut.",
    longDesc: "Cookies klasik dengan adonan buttery yang lembut dan potongan cokelat premium. Sempurna untuk segala suasana.",
    price: 18000,
    emoji: "🍪",
    featured: false
  },
  {
    id: 2,
    name: "Caramel Cloud",
    desc: "Soft caramel center dengan golden edge yang renyah.",
    longDesc: "Favorit pelanggan! Pusat caramel yang lembut dikelilingi tepi golden yang renyah. Rasanya seperti pelukan hangat.",
    price: 22000,
    emoji: "🍪",
    featured: true
  },
  {
    id: 3,
    name: "Hazelnut Hug",
    desc: "Toasty hazelnuts dan silky chocolate yang nikmat.",
    longDesc: "Kombinasi hazelnut panggang yang gurih dengan cokelat silky. Setiap gigitan terasa premium.",
    price: 24000,
    emoji: "🍪",
    featured: false
  },
  {
    id: 4,
    name: "Berry Crumble",
    desc: "Sweet berry bits dengan buttery crumble yang manis.",
    longDesc: "Berry kering yang manis dipadukan dengan crumble buttery. Segar dan nyaman di waktu yang sama.",
    price: 20000,
    emoji: "🍪",
    featured: false
  },
  {
    id: 5,
    name: "Matcha Dream",
    desc: "Matcha lembut dengan white chocolate yang creamy.",
    longDesc: "Matcha Jepang yang earthy dipadukan dengan white chocolate. Rasanya calm tapi addictive.",
    price: 25000,
    emoji: "🍵",
    featured: false
  },
  {
    id: 6,
    name: "Peanut Butter Bliss",
    desc: "Creamy peanut butter dengan sedikit garam yang pas.",
    longDesc: "Peanut butter yang creamy dan sedikit asin. Cocok buat yang suka rasa classic American.",
    price: 21000,
    emoji: "🥜",
    featured: false
  },
  {
    id: 7,
    name: "Cinnamon Roll",
    desc: "Aroma cinnamon hangat dengan icing tipis yang manis.",
    longDesc: "Seperti cinnamon roll tapi dalam bentuk cookies. Wangi cinnamon yang mengundang.",
    price: 19000,
    emoji: "🍂",
    featured: false
  },
  {
    id: 8,
    name: "Double Choco",
    desc: "Cokelat gelap + cokelat susu, double the happiness.",
    longDesc: "Untuk pecinta cokelat sejati. Dua jenis cokelat yang meleleh sempurna.",
    price: 23000,
    emoji: "🍫",
    featured: true
  },
  {
    id: 9,
    name: "Oatmeal Raisin",
    desc: "Oatmeal chewy dengan raisin manis yang sehat.",
    longDesc: "Pilihan yang lebih “sehat” tapi tetap enak. Chewy dan penuh tekstur.",
    price: 17000,
    emoji: "🌾",
    featured: false
  },
  {
    id: 10,
    name: "Salted Caramel",
    desc: "Caramel manis dengan sentuhan garam laut.",
    longDesc: "Keseimbangan manis-asin yang bikin ketagihan. Salted caramel yang premium.",
    price: 26000,
    emoji: "🧂",
    featured: false
  }
];

// State
let cart = JSON.parse(localStorage.getItem('crumb-cart') || '[]');

// DOM elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartOverlay = document.getElementById('cart-overlay');
const productModal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');
const modalOverlay = document.getElementById('modal-overlay');
const welcomeModal = document.getElementById('welcome-modal');
const toast = document.getElementById('toast');

// Init
function init() {
  renderProducts();
  updateCartUI();
  setupEventListeners();
  
  // Show welcome only if not seen this session
  if (!sessionStorage.getItem('welcome-seen')) {
    welcomeModal.classList.remove('hidden');
  } else {
    welcomeModal.classList.add('hidden');
  }
}

function renderProducts() {
  productGrid.innerHTML = products.map(p => `
    <article class="card ${p.featured ? 'featured' : ''}" data-id="${p.id}">
      <div class="cookie-icon">${p.emoji}</div>
      <span>${String(p.id).padStart(2, '0')}${p.featured ? ' · favorite' : ''}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">Rp ${p.price.toLocaleString('id-ID')}</div>
      <button class="btn primary add-btn" data-add="${p.id}">Tambah ke Keranjang</button>
    </article>
  `).join('');
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px 0;">Keranjang masih kosong.<br>Yuk pilih cookies favoritmu!</p>';
  } else {
    cartItems.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${product.name}</strong>
            <small>Rp ${product.price.toLocaleString('id-ID')} × ${item.qty}</small>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" data-dec="${item.id}">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-inc="${item.id}">+</button>
          </div>
        </div>
      `;
    }).join('');
  }
  
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product.price * item.qty);
  }, 0);
  cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  
  localStorage.setItem('crumb-cart', JSON.stringify(cart));
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  updateCartUI();
  showToast('Cookies ditambahkan ke keranjang ♡');
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
}

function openProductModal(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;
  modalBody.innerHTML = `
    <div style="text-align:center;font-size:60px;margin-bottom:10px;">${p.emoji}</div>
    <h2 style="font-family:'Playfair Display',serif;margin:0 0 8px;">${p.name}</h2>
    <div style="color:var(--copper);font-weight:700;font-size:20px;margin-bottom:12px;">Rp ${p.price.toLocaleString('id-ID')}</div>
    <p style="color:var(--muted);line-height:1.6;">${p.longDesc}</p>
    <button class="btn primary full" style="margin-top:20px;" data-add-modal="${p.id}">Tambah ke Keranjang</button>
  `;
  productModal.classList.add('show');
  modalOverlay.classList.add('show');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function setupEventListeners() {
  // Welcome
  document.getElementById('welcome-btn').addEventListener('click', () => {
    welcomeModal.classList.add('hidden');
    sessionStorage.setItem('welcome-seen', '1');
  });

  // Product cards
  productGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      e.stopPropagation();
      addToCart(parseInt(addBtn.dataset.add));
    } else if (card) {
      openProductModal(parseInt(card.dataset.id));
    }
  });

  // Modal add
  modalBody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add-modal]');
    if (btn) {
      addToCart(parseInt(btn.dataset.addModal));
      productModal.classList.remove('show');
      modalOverlay.classList.remove('show');
    }
  });

  document.getElementById('close-modal').addEventListener('click', () => {
    productModal.classList.remove('show');
    modalOverlay.classList.remove('show');
  });
  modalOverlay.addEventListener('click', () => {
    productModal.classList.remove('show');
    modalOverlay.classList.remove('show');
  });

  // Cart
  document.getElementById('open-cart').addEventListener('click', () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
  });
  document.getElementById('close-cart').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  cartItems.addEventListener('click', (e) => {
    if (e.target.dataset.inc) changeQty(parseInt(e.target.dataset.inc), 1);
    if (e.target.dataset.dec) changeQty(parseInt(e.target.dataset.dec), -1);
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Keranjang masih kosong!');
      return;
    }
    const itemsText = cart.map(item => {
      const p = products.find(pr => pr.id === item.id);
      return `${p.name} x${item.qty}`;
    }).join(', ');
    const total = cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.qty, 0);
    const msg = `Halo Crumb & Co.! Saya mau pesan:\n${itemsText}\nTotal: Rp ${total.toLocaleString('id-ID')}\nNama: \nAlamat: `;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // Mobile menu
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('main-nav').classList.toggle('open');
  });

  // Order form
  document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const phone = fd.get('phone');
    const note = fd.get('note') || '-';
    const msg = `Halo Crumb & Co.! Saya ${name} (${phone}) mau pesan cookies.\nCatatan: ${note}`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Membuka WhatsApp...');
    e.target.reset();
  });

  // Draggable Follow Us
  makeDraggable(document.getElementById('follow-us'));
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('show');
}

// Draggable function
function makeDraggable(el) {
  if (!el) return;
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  el.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a')) return; // jangan drag kalau klik link
    isDragging = true;
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    el.style.transition = 'none';
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    // batas layar
    x = Math.max(10, Math.min(window.innerWidth - el.offsetWidth - 10, x));
    y = Math.max(10, Math.min(window.innerHeight - el.offsetHeight - 10, y));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  });

  el.addEventListener('pointerup', () => {
    isDragging = false;
    el.style.transition = '';
  });
}

// Start
init();
