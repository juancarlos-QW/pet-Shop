
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');

  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

const WHATSAPP = '5554999646718';

let products = JSON.parse(localStorage.getItem('products')) || [
  {
    id: 1,
    name: 'Ração Premium Cães 10kg',
    category: 'racao',
    price: 129.90,
    image: 'assets/racao-cachorro.jpeg',
    rating: 5,
    badge: 'Mais vendido',
    description: 'Ração premium para cães adultos com alta qualidade nutricional.'
  },
  {
    id: 2,
    name: 'Ração Gatos Castrados 3kg',
    category: 'racao',
    price: 89.90,
    image: 'assets/racao-gato.jpeg',
    rating: 5,
    badge: 'Oferta',
    description: 'Ideal para gatos castrados, ajuda no controle de peso.'
  },
  {
    id: 3,
    name: 'Mordedor Resistente',
    category: 'brinquedo',
    price: 29.90,
    image: 'assets/mordedor.jpeg',
    rating: 4,
    badge: 'Novo',
    description: 'Brinquedo resistente para diversão e saúde dental.'
  },
  {
    id: 4,
    name: 'Bolinha Interativa',
    category: 'brinquedo',
    price: 19.90,
    image: 'assets/coleira-gato.jpeg',
    rating: 4,
    badge: 'Popular',
    description: 'Bolinha interativa para estimular o pet durante o dia.'
  },
  {
    id: 5,
    name: 'Coleira Ajustável',
    category: 'acessorio',
    price: 34.90,
    image: 'assets/coleira-pet.jpeg',
    rating: 5,
    badge: 'Top',
    description: 'Coleira confortável, segura e ajustável.'
  },
  {
    id: 6,
    name: 'Caminha Conforto',
    category: 'acessorio',
    price: 159.90,
    image: 'assets/coleira-gato.jpeg',
    rating: 5,
    badge: 'Premium',
    description: 'Caminha macia e confortável para descanso do pet.'
  },
  {
    id: 7,
    name: 'Shampoo Neutro Pet',
    category: 'higiene',
    price: 24.90,
    image: 'assets/shampoo.jpeg',
    rating: 4,
    badge: 'Essencial',
    description: 'Shampoo neutro para banho seguro e cheiroso.'
  },
  {
    id: 8,
    name: 'Tapete Higiênico 30un',
    category: 'higiene',
    price: 49.90,
    image: 'assets/coleira-gato.jpeg',
    rating: 5,
    badge: 'Prático',
    description: 'Tapetes higiênicos absorventes para cães.'
  }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const productModal = document.getElementById('productModal');
const productModalContent = document.getElementById('productModalContent');

function money(value) {
  return Number(value).toFixed(2).replace('.', ',');
}

function stars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  if (!cartCount) return;
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function renderProducts() {
  if (!productGrid) return;

  const search = searchInput ? searchInput.value.toLowerCase() : '';
  const category = categoryFilter ? categoryFilter.value : 'todos';

  const filtered = products.filter(product => {
    return product.name.toLowerCase().includes(search) &&
      (category === 'todos' || product.category === category);
  });

  productGrid.innerHTML = filtered.map(product => `
    <article class="product">
      <span class="badge">${product.badge}</span>
      <img class="product-img" src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="stars">${stars(product.rating)}</p>
      <p>Categoria: ${product.category}</p>
      <p class="price">R$ ${money(product.price)}</p>

      <button class="btn secondary" onclick="openProductModal(${product.id})">
        Ver detalhes
      </button>

      <button class="btn primary" onclick="addToCart(${product.id})">
        Adicionar
      </button>
    </article>
  `).join('') || '<p>Nenhum produto encontrado.</p>';
}

function openProductModal(id) {
  const product = products.find(item => item.id === id);
  if (!product || !productModal || !productModalContent) return;

  productModalContent.innerHTML = `
    <img class="modal-product-img" src="${product.image}" alt="${product.name}">
    <span class="badge">${product.badge}</span>
    <h2>${product.name}</h2>
    <p class="stars">${stars(product.rating)}</p>
    <p>${product.description}</p>
    <h3>R$ ${money(product.price)}</h3>

    <button class="btn primary" onclick="addToCart(${product.id}); closeProductModal();">
      Adicionar ao carrinho
    </button>
  `;

  productModal.classList.add('active');
}

function closeProductModal() {
  if (productModal) productModal.classList.remove('active');
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  showToast('🛒 Produto adicionado ao carrinho!', 'success');

  const item = cart.find(item => item.id === id);

  if (item) item.quantity += 1;
  else cart.push({ ...product, quantity: 1 });

  saveCart();
}

function decreaseCartItem(id) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  showToast('🗑️ Produto removido!', 'warning');
}

function clearCart() {
  if (!cart.length) {
    alert('Seu carrinho já está vazio.');
    return;
  }

  if (confirm('Deseja limpar todo o carrinho?')) {
    cart = [];
    saveCart();
  }
}

function renderCart() {
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">

      <div>
        <strong>${item.name}</strong>
        <p>R$ ${money(item.price)}</p>

        <div class="cart-controls">
          <button onclick="decreaseCartItem(${item.id})">−</button>
          <span>${item.quantity}</span>
          <button onclick="addToCart(${item.id})">+</button>
        </div>

        <button class="remove-btn" onclick="removeFromCart(${item.id})">
          Remover
        </button>
      </div>
    </div>
  `).join('') : '<p>Seu carrinho está vazio.</p>';

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = money(total);
}

function checkoutWhatsApp() {
  if (!cart.length) {
    alert('Seu carrinho está vazio.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = {
    id: Date.now(),
    date: new Date().toLocaleString('pt-BR'),
    total,
    items: cart
  };

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  const orderText = cart.map(item =>
    `${item.quantity}x ${item.name} - R$ ${money(item.price * item.quantity)}`
  ).join('%0A');

  window.open(
    `https://wa.me/${WHATSAPP}?text=Olá! Quero finalizar meu pedido:%0A%0A${orderText}%0A%0ATotal: R$ ${money(total)}`,
    '_blank'
  );

  cart = [];
  saveCart();
  renderDashboard();
}

/* ADMIN */

function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
  renderProducts();
  renderAdminProducts();
  renderDashboard();
}

function renderAdminProducts() {
  const container = document.getElementById('adminProducts');
  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="admin-product">
      <img src="${product.image}" alt="${product.name}">

      <div>
        <strong>${product.name}</strong>
        <p>R$ ${money(product.price)}</p>
        <small>${product.category}</small>
      </div>

      <div class="admin-actions">
        <button class="edit-btn" onclick="editProduct(${product.id})">
          Editar
        </button>

        <button class="delete-btn" onclick="deleteProduct(${product.id})">
          Excluir
        </button>
      </div>
    </div>
  `).join('');
}

function deleteProduct(id) {
  if (!confirm('Deseja excluir este produto?')) return;

  products = products.filter(product => product.id !== id);
  cart = cart.filter(item => item.id !== id);

  saveProducts();
  saveCart();
}

function editProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  document.getElementById('editingProductId').value = product.id;
  document.getElementById('adminName').value = product.name;
  document.getElementById('adminPrice').value = product.price;
  document.getElementById('adminCategory').value = product.category;
  document.getElementById('adminDescription').value = product.description;

  document.getElementById('saveProductBtn').textContent = 'Atualizar Produto';
  document.getElementById('cancelEditBtn').style.display = 'inline-block';

  document.getElementById('adminArea').scrollIntoView({ behavior: 'smooth' });
}

function clearAdminForm() {
  document.getElementById('editingProductId').value = '';
  document.getElementById('adminName').value = '';
  document.getElementById('adminPrice').value = '';
  document.getElementById('adminCategory').value = 'racao';
  document.getElementById('adminImageFile').value = '';
  document.getElementById('adminDescription').value = '';

  document.getElementById('saveProductBtn').textContent = 'Salvar Produto';
  document.getElementById('cancelEditBtn').style.display = 'none';
}

function getImageFromInput(callback) {
  const fileInput = document.getElementById('adminImageFile');
  const file = fileInput.files[0];

  if (!file) {
    callback(null);
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    callback(event.target.result);
  };

  reader.readAsDataURL(file);
}

function renderDashboard() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  const totalProducts = document.getElementById('totalProducts');
  const totalOrders = document.getElementById('totalOrders');
  const totalClients = document.getElementById('totalClients');
  const totalRevenue = document.getElementById('totalRevenue');
  const ordersList = document.getElementById('ordersList');
  const salesChart = document.getElementById('salesChart');
  const topProducts = document.getElementById('topProducts');

  if (!totalProducts || !ordersList) return;

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  totalProducts.textContent = products.length;
  totalOrders.textContent = orders.length;
  totalClients.textContent = orders.length;
  totalRevenue.textContent = `R$ ${money(revenue)}`;

  ordersList.innerHTML = orders.length
    ? orders.map(order => `
      <div class="order-card">
        <strong>Pedido #${order.id}</strong>
        <p>Total: R$ ${money(order.total)}</p>
        <small>${order.date}</small>
      </div>
    `).join('')
    : '<p>Nenhum pedido registrado.</p>';

  if (salesChart) {
    const maxValue = Math.max(...orders.map(order => order.total), 1);

    salesChart.innerHTML = orders.length
      ? orders.slice(-8).map(order => {
        const height = Math.max((order.total / maxValue) * 100, 8);

        return `
          <div class="chart-bar" style="height:${height}%">
            <span>R$ ${money(order.total)}</span>
          </div>
        `;
      }).join('')
      : '<p>Nenhum dado de venda ainda.</p>';
  }

  if (topProducts) {
    const productSales = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = 0;
        }

        productSales[item.name] += item.quantity;
      });
    });

    const ranking = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    topProducts.innerHTML = ranking.length
      ? ranking.map(([name, quantity], index) => `
        <div class="top-product-item">
          <span>${index + 1}. ${name}</span>
          <strong>${quantity} vendidos</strong>
        </div>
      `).join('')
      : '<p>Nenhum produto vendido ainda.</p>';
  }
}


/* LOGIN */

const openLogin = document.getElementById('openLogin');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');
const loginBtn = document.getElementById('loginBtn');

if (openLogin) {
  openLogin.addEventListener('click', event => {
    event.preventDefault();
    loginModal.classList.add('active');
  });
}

if (closeLogin) {
  closeLogin.addEventListener('click', () => {
    loginModal.classList.remove('active');
  });
}

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email === 'cliente@petcare.com' && password === '123456') {
      loginModal.classList.remove('active');
      document.getElementById('clientArea').classList.add('active');
      document.getElementById('adminArea').classList.remove('active');
      alert('Login de cliente realizado!');
      return;
    }

    if (email === 'admin@petcare.com' && password === 'admin123') {
      loginModal.classList.remove('active');
      document.getElementById('adminArea').classList.add('active');
      document.getElementById('clientArea').classList.remove('active');
      renderDashboard();
      renderAdminProducts();
      showToast('✅ Login de administrador realizado!', 'success');
      return;
    }

    showToast('❌ E-mail ou senha inválidos.', 'error');
  });
}

/* EVENTOS */

document.getElementById('menuBtn')?.addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
});

document.getElementById('cartBtn')?.addEventListener('click', () => {
  renderCart();
  cartModal.classList.add('active');
});

document.getElementById('closeCart')?.addEventListener('click', () => {
  cartModal.classList.remove('active');
});

document.getElementById('checkoutBtn')?.addEventListener('click', checkoutWhatsApp);

document.getElementById('closeProductModal')?.addEventListener('click', closeProductModal);

searchInput?.addEventListener('input', renderProducts);
categoryFilter?.addEventListener('change', renderProducts);

document.getElementById('bookingForm')?.addEventListener('submit', event => {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const pet = document.getElementById('pet').value;
  const servico = document.getElementById('servico').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  const message = `Olá! Quero agendar:%0ACliente: ${nome}%0APet: ${pet}%0AServiço: ${servico}%0AData: ${data}%0AHora: ${hora}`;

  window.open(`https://wa.me/${WHATSAPP}?text=${message}`, '_blank');
});

document.getElementById('topBtn')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('darkModeBtn')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

document.getElementById('saveProductBtn')?.addEventListener('click', () => {
  const editingId = document.getElementById('editingProductId').value;
  const name = document.getElementById('adminName').value.trim();
  const price = Number(document.getElementById('adminPrice').value);
  const category = document.getElementById('adminCategory').value;
  const description = document.getElementById('adminDescription').value.trim();

  if (!name || !price || !category || !description) {
    alert('Preencha todos os campos.');
    return;
  }

  getImageFromInput(imageBase64 => {
    if (editingId) {
      products = products.map(product => {
        if (product.id === Number(editingId)) {
          return {
            ...product,
            name,
            price,
            category,
            description,
            image: imageBase64 || product.image
          };
        }

        return product;
      });

      alert('Produto atualizado!');
    } else {
      if (!imageBase64) {
        showToast('✅ Produto atualizado!', 'success');
        return;
      }

      products.push({
        id: Date.now(),
        name,
        category,
        price,
        image: imageBase64,
        rating: 5,
        badge: 'Novo',
        description
      });

      showToast('✅ Produto cadastrado!', 'success');
    }

    saveProducts();
    clearAdminForm();
  });
});

document.getElementById('cancelEditBtn')?.addEventListener('click', clearAdminForm);

/* INICIALIZAÇÃO */

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hide');
  }, 800);
});

const counters = document.querySelectorAll('.stats strong');

counters.forEach(counter => {
  const original = counter.textContent;
  const target = parseInt(original.replace(/\D/g, ''));

  if (!target) return;

  let count = 0;
  const increment = Math.ceil(target / 80);

  const interval = setInterval(() => {
    count += increment;

    if (count >= target) {
      counter.textContent = original;
      clearInterval(interval);
    } else {
      counter.textContent = '+' + count;
    }
  }, 25);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
});

document.querySelectorAll('.card, .product, .section, .benefits, .stats').forEach(element => {
  element.classList.add('hidden');
  observer.observe(element);
});

renderProducts();
updateCartCount();
renderCart();
renderAdminProducts();
renderDashboard();

/* SLIDER DE IMAGENS DO CACHORRO */

const dogSliderTrack = document.getElementById('dogSliderTrack');
const dogSlides = document.querySelectorAll('.dog-slider-track img');

let dogSlideIndex = 0;

function moveDogSlider() {
  if (!dogSliderTrack || !dogSlides.length) return;

  dogSlideIndex = (dogSlideIndex + 1) % dogSlides.length;

  dogSliderTrack.style.transform = `translateX(-${dogSlideIndex * 100}%)`;
}

setInterval(moveDogSlider, 3500);