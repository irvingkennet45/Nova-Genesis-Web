/* ==========================================================================
   Nova Genesis - Main Global JavaScript
   Essential baseline script present on EVERY page of the site:
   Navigation menus, Cart drawer, Shared interactive motion, Global utilities
   ========================================================================== */

const CART_KEY = 'nova-genesis-cart';
const ORDER_KEY = 'nova-genesis-order';

/* --------------------------------------------------------------------------
   Global URL & Storage Utilities
   -------------------------------------------------------------------------- */

function resolveSiteRootPath() {
  const pathname = window.location.pathname.replace(/\\/g, '/');
  if (pathname.includes('/shop/products/')) return '../../';
  if (pathname.includes('/shop/categories/')) return '../../';
  if (pathname.includes('/shop/collections/')) return '../../';
  if (pathname.includes('/shop/')) return '../';
  return './';
}

function resolveProductDataPath() {
  const pathname = window.location.pathname.replace(/\\/g, '/');
  if (pathname.includes('/shop/categories/')) return '../../core/data/products.json';
  if (pathname.includes('/shop/collections/')) return '../../core/data/products.json';
  if (pathname.includes('/shop/products/')) return '../../core/data/products.json';
  if (pathname.includes('/shop/')) return '../core/data/products.json';
  return './core/data/products.json';
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getCartItems() {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

async function ensureProductsLoaded() {
  if (window.NOVA_PRODUCTS && window.NOVA_PRODUCTS.length) {
    return window.NOVA_PRODUCTS;
  }

  try {
    const response = await fetch(resolveProductDataPath());
    if (!response.ok) return [];
    const payload = await response.json();
    const products = Array.isArray(payload.products) ? payload.products : [];
    window.NOVA_PRODUCTS = products;
    return products;
  } catch (error) {
    return [];
  }
}

/* --------------------------------------------------------------------------
   Global Cart Operations (Cart Drawer resides in header on all pages)
   -------------------------------------------------------------------------- */

async function addToCart(productId, quantity = 1) {
  const products = await ensureProductsLoaded();
  const product = products.find((entry) => entry.id === productId) || null;
  if (!product) return;

  const stockText = String(product.inStockFlag || '').toLowerCase();
  const maxUnits = Number(product.units || 0);
  if (stockText.includes('out') || maxUnits <= 0) return;

  const requested = Math.max(1, Math.floor(Number(quantity) || 1));
  const safeQuantity = maxUnits > 0 ? Math.min(requested, maxUnits) : requested;

  const items = getCartItems();
  const match = items.find((entry) => entry.id === productId);

  if (match) {
    const nextTotal = match.quantity + safeQuantity;
    match.quantity = maxUnits > 0 ? Math.min(nextTotal, maxUnits) : nextTotal;
  } else {
    items.push({ id: productId, quantity: safeQuantity });
  }

  saveCartItems(items);
  renderCartDrawer();

  // Open cart drawer so customer gets instant feedback
  const bagMenuWrap = document.querySelector('.bag-menu-wrap');
  const cartPanel = document.querySelector('.cart-panel');
  const bagButton = document.querySelector('.bag-button');
  if (bagMenuWrap && cartPanel) {
    bagMenuWrap.classList.add('is-open');
    cartPanel.classList.add('is-open');
    if (bagButton) {
      bagButton.setAttribute('aria-expanded', 'true');
    }
  }

  // If on checkout page, notify store checkout summary
  if (typeof window.renderCheckoutSummary === 'function') {
    window.renderCheckoutSummary();
  }
}

function removeFromCart(productId) {
  const nextItems = getCartItems().filter((entry) => entry.id !== productId);
  saveCartItems(nextItems);
  renderCartDrawer();

  if (typeof window.renderCheckoutSummary === 'function') {
    window.renderCheckoutSummary();
  }
}

async function renderCartDrawer() {
  const panel = document.querySelector('.cart-panel');
  if (!panel) return;

  const items = getCartItems();
  const list = panel.querySelector('.cart-items');
  const total = panel.querySelector('.cart-total strong');
  const count = panel.querySelector('.cart-count');

  if (!list || !total || !count) return;

  if (!items.length) {
    list.innerHTML = `
      <div class="empty-cart">
        <strong>your cart is empty.</strong>
        <span>add a poster, wallpaper, or typeface to get started.</span>
      </div>
    `;
    total.textContent = '$0.00';
    count.textContent = '0 items';
    return;
  }

  const products = await ensureProductsLoaded();
  const entries = items
    .map((entry) => {
      const product = products.find((item) => item.id === entry.id);
      if (!product) return null;
      return {
        ...product,
        quantity: entry.quantity,
        lineTotal: Number(product.productPrice) * entry.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = entries.reduce((sum, item) => sum + item.lineTotal, 0);
  const rootPath = resolveSiteRootPath();

  list.innerHTML = entries.map((item) => {
    const rawImg = item.cardImage || item.productImage;
    const imgSrc = rawImg ? `${rootPath}${rawImg.replace(/^\.\//, '').replace(/^\//, '')}` : '';
    const visualContent = imgSrc ? `<img src="${imgSrc}" alt="${item.productTitle}" />` : '';

    return `
      <div class="cart-item">
        <div class="cart-item-visual" aria-hidden="true">${visualContent}</div>
        <div class="cart-item-copy">
          <strong>${item.productTitle}</strong>
          <span>qty: ${item.quantity}</span>
        </div>
        <div class="cart-item-end">
          <span class="cart-item-total">${formatMoney(item.lineTotal)}</span>
          <button class="cart-item-remove" type="button" data-product-id="${item.id}" aria-label="Remove ${item.productTitle} from cart">remove</button>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.cart-item-remove').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      removeFromCart(button.dataset.productId);
    });
  });

  total.textContent = formatMoney(subtotal);
  count.textContent = `${entries.reduce((sum, item) => sum + item.quantity, 0)} items`;
}

function initializeCartHeader() {
  const bagMenuWrap = document.querySelector('.bag-menu-wrap');
  const bagButton = document.querySelector('.bag-button');

  if (bagMenuWrap && bagButton) {
    bagButton.setAttribute('aria-expanded', 'false');

    bagButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = bagMenuWrap.classList.toggle('is-open');
      document.querySelector('.cart-panel')?.classList.toggle('is-open');
      bagButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.addEventListener('click', (event) => {
    if (bagMenuWrap && !bagMenuWrap.contains(event.target)) {
      bagMenuWrap.classList.remove('is-open');
      document.querySelector('.cart-panel')?.classList.remove('is-open');
      if (bagButton) {
        bagButton.setAttribute('aria-expanded', 'false');
      }
    }
  });

  renderCartDrawer();
}

/* --------------------------------------------------------------------------
   Header Navigation & Shop Dropdown
   -------------------------------------------------------------------------- */

const shopMenuWrap = document.querySelector('.shop-menu-wrap');
const shopTrigger = document.querySelector('.nav-item-link--shop');
const shopDropdown = document.querySelector('.shop-dropdown');

const syncDropdownWidth = () => {
  if (!shopDropdown || !shopMenuWrap) return;
  const activeSubmenu = document.querySelector('.shop-submenu.is-visible');
  shopDropdown.style.setProperty('--dropdown-width', activeSubmenu ? 'min(560px, 46vw)' : 'min(335px, 31vw)');
  shopMenuWrap.style.setProperty('--submenu-width', activeSubmenu ? 'min(300px, 28vw)' : '0px');
};

const closeShopMenu = () => {
  if (!shopMenuWrap) return;
  shopMenuWrap.classList.remove('is-open');
  if (shopDropdown) {
    shopDropdown.classList.remove('is-open');
  }
  if (shopTrigger) {
    shopTrigger.setAttribute('aria-expanded', 'false');
  }
  syncDropdownWidth();
};

const openShopMenu = () => {
  if (!shopMenuWrap) return;
  shopMenuWrap.classList.add('is-open');
  if (shopDropdown) {
    shopDropdown.classList.add('is-open');
  }
  if (shopTrigger) {
    shopTrigger.setAttribute('aria-expanded', 'true');
  }
  syncDropdownWidth();
};

function initializeShopNavigation() {
  if (shopTrigger && shopMenuWrap) {
    shopTrigger.addEventListener('mouseenter', openShopMenu);
    shopTrigger.addEventListener('focus', openShopMenu);
    shopTrigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = shopMenuWrap.classList.contains('is-open');
      shopMenuWrap.dataset.pinned = String(!isOpen);
      if (isOpen) {
        closeShopMenu();
      } else {
        openShopMenu();
      }
    });

    shopMenuWrap.addEventListener('mouseenter', openShopMenu);
    shopMenuWrap.addEventListener('mouseleave', () => {
      if (shopMenuWrap.dataset.pinned !== 'true') {
        closeShopMenu();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (shopMenuWrap && !shopMenuWrap.contains(event.target)) {
      shopMenuWrap.dataset.pinned = 'false';
      closeShopMenu();
    }
  });

  const shopGroupButtons = document.querySelectorAll('.dropdown-link--group');
  shopGroupButtons.forEach((button) => {
    if (!button.dataset.group) return;

    const showGroup = () => {
      document.querySelectorAll('.dropdown-link--group').forEach((link) => link.classList.remove('is-active'));
      document.querySelectorAll('.shop-submenu').forEach((submenu) => submenu.classList.remove('is-visible'));

      button.classList.add('is-active');

      const activePanel = document.getElementById(`group-${button.dataset.group}`);
      if (activePanel) {
        activePanel.classList.add('is-visible');
      }

      syncDropdownWidth();
    };

    button.addEventListener('mouseenter', () => {
      openShopMenu();
      showGroup();
    });
    button.addEventListener('focus', showGroup);
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      shopMenuWrap.dataset.pinned = 'true';
      openShopMenu();
      showGroup();
    });
  });

  syncDropdownWidth();
}

/* --------------------------------------------------------------------------
   Interactive 3D Motion Helper
   -------------------------------------------------------------------------- */

const bindInteractiveMotion = (selector) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (element.dataset.tiltBound === 'true') return;
    element.dataset.tiltBound = 'true';

    let resetTimer = null;

    const reset = () => {
      element.style.setProperty('--tilt-x', '0deg');
      element.style.setProperty('--tilt-y', '0deg');
      element.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    const handleMove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 18;
      const rotateX = (0.5 - y) * 16;

      element.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
      element.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
      element.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;

      if (resetTimer) {
        clearTimeout(resetTimer);
      }
      resetTimer = setTimeout(() => {
        reset();
      }, 1200);
    };

    ['pointermove', 'mousemove'].forEach((eventName) => {
      element.addEventListener(eventName, handleMove);
    });

    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    element.addEventListener('mouseleave', reset);
    element.addEventListener('blur', reset);
  });
};

/* --------------------------------------------------------------------------
   Expose Public Utilities & Global Initialization
   -------------------------------------------------------------------------- */

window.CART_KEY = CART_KEY;
window.ORDER_KEY = ORDER_KEY;
window.getCartItems = getCartItems;
window.saveCartItems = saveCartItems;
window.formatMoney = formatMoney;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.renderCartDrawer = renderCartDrawer;
window.bindInteractiveMotion = bindInteractiveMotion;
window.resolveSiteRootPath = resolveSiteRootPath;
window.resolveProductDataPath = resolveProductDataPath;
window.ensureProductsLoaded = ensureProductsLoaded;

document.addEventListener('DOMContentLoaded', () => {
  initializeShopNavigation();
  initializeCartHeader();
  bindInteractiveMotion('.bag-button, .shop-submenu');
});
