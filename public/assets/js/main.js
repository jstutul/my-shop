// ShopHub – main.js
// Lightweight interactivity for the static template

document.addEventListener('DOMContentLoaded', () => {

  // ── Cart count from localStorage ──────────────────────
  function getCartCount() {
    const cart = JSON.parse(localStorage.getItem('shophub_cart') || '[]');
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function updateCartBadge() {
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = getCartCount();
    });
  }

  // ── Add to cart ────────────────────────────────────────
  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id || '1';
      const productName = btn.dataset.name || 'Product';
      const productPrice = parseFloat(btn.dataset.price || '0');
      const productImg = btn.dataset.img || 'https://via.placeholder.com/80';

      let cart = JSON.parse(localStorage.getItem('shophub_cart') || '[]');
      const existing = cart.find(i => i.id === productId);
      if (existing) { existing.qty += 1; }
      else { cart.push({ id: productId, name: productName, price: productPrice, img: productImg, qty: 1 }); }
      localStorage.setItem('shophub_cart', JSON.stringify(cart));
      updateCartBadge();

      btn.textContent = 'Added!';
      btn.classList.replace('btn-primary', 'btn-success');
      setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.replace('btn-success', 'btn-primary'); }, 1500);
    });
  });

  // ── Quantity controls ──────────────────────────────────
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-group').querySelector('.qty-input');
      const val = parseInt(input.value);
      if (val > 1) { input.value = val - 1; recalcCart(); }
    });
  });
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-group').querySelector('.qty-input');
      input.value = parseInt(input.value) + 1;
      recalcCart();
    });
  });

  function recalcCart() {
    let subtotal = 0;
    document.querySelectorAll('.cart-row').forEach(row => {
      const price = parseFloat(row.dataset.price || '0');
      const qty = parseInt(row.querySelector('.qty-input')?.value || '1');
      const lineTotal = price * qty;
      const lineTotalEl = row.querySelector('.line-total');
      if (lineTotalEl) lineTotalEl.textContent = '$' + lineTotal.toFixed(2);
      subtotal += lineTotal;
    });
    const shipping = subtotal > 0 ? 9.99 : 0;
    const total = subtotal + shipping;
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (shippingEl) shippingEl.textContent = '$' + shipping.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  }

  // ── Checkout form validation ───────────────────────────
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // ── Star rating hover ──────────────────────────────────
  document.querySelectorAll('.star-rating i').forEach((star, i, stars) => {
    star.addEventListener('mouseover', () => {
      stars.forEach((s, j) => { s.className = j <= i ? 'bi bi-star-fill text-warning' : 'bi bi-star text-warning'; });
    });
  });

  updateCartBadge();
});
