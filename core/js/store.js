/* ==========================================================================
   Nova Genesis - Store & Commerce JavaScript
   Handles catalog rendering, product filtering, dynamic product pages,
   product details, checkout validation, and order confirmation.
   ========================================================================== */

function resolveProductDataPath() {
  const pathname = window.location.pathname;
  if (typeof window.resolveProductDataPath === 'function') {
    return window.resolveProductDataPath();
  }
  const pathname = window.location.pathname.replace(/\\/g, '/');
  if (pathname.includes('/shop/categories/')) return '../../core/data/products.json';
  if (pathname.includes('/shop/collections/')) return '../../core/data/products.json';
  if (pathname.includes('/shop/products/')) return '../../core/data/products.json';
  if (pathname.includes('/shop/')) return '../core/data/products.json';
  return './core/data/products.json';
}

function resolveSiteRootPath() {
  if (typeof window.resolveSiteRootPath === 'function') {
    return window.resolveSiteRootPath();
  }
  const pathname = window.location.pathname.replace(/\\/g, '/');
  if (pathname.includes('/shop/products/')) return '../../';
  if (pathname.includes('/shop/categories/')) return '../../';
  if (pathname.includes('/shop/collections/')) return '../../';
  if (pathname.includes('/shop/')) return '../';
  return './';
}

function formatMoney(value) {
  if (typeof window.formatMoney === 'function') {
    return window.formatMoney(value);
  }
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatStockLabel(value) {
  const text = String(value || 'In-Stock').trim().toLowerCase();
  if (text.includes('out')) return 'out of stock';
  if (text.includes('low')) return 'low stock';
  return 'in stock';
}

function resolveProductVisual(product) {
  if (!product) return null;

  const normalized = (product.productTitle || '').toLowerCase();
  const collectionName = String(product.collection || '').toLowerCase();
  const assetRoot = `${resolveSiteRootPath()}assets/imgs/`;

  const mapping = {
    'asap rocky': 'dont be dumb asap.jpg',
    'blood orange': 'dark and handsome blood orange.jpg',
    'jackboys': 'jackboys ii.jpg',
    'don toliver': 'don toliver octane 2.jpg',
    'vision': 'vision.jpg',
    'company don': 'company don.jpg',
    'night scene': 'night scene v2 don toliver.jpg',
    'weeknd': 'weeknd.jpg',
    'static': 'static.jpg',
    'its been awful': 'its been awful rashad.jpg',
    'gnx': 'gnx kendrick lamar.jpg',
    'y2k': 'y2k main.jpg',
    'fashion': 'say it louder.jpg',
    'say it louder': 'say it louder.jpg'
  };

  if (collectionName.includes('y2k')) return `${assetRoot}y2k main.jpg`;
  if (collectionName.includes('fashion')) return `${assetRoot}say it louder.jpg`;

  const matchedKey = Object.keys(mapping).find((key) => normalized.includes(key));
  if (matchedKey) {
    return `${assetRoot}${mapping[matchedKey]}`;
  }

  return null;
}

function getProductFontFamily(product) {
  const source = (product?.fontFamily || product?.productTitle || product?.type || '').toLowerCase();
  if (source.includes('jetbrains') || source.includes('mono')) return "'JetBrains Mono', monospace";
  if (source.includes('clash')) return "'Clash Display', sans-serif";
  if (source.includes('octane') || source.includes('high')) return "'High Octane', sans-serif";
  return "'Clash Display', sans-serif";
}

function renderProductVisual(product, variant = 'card') {
  const imageUrl = resolveProductVisual(product);
  const isTypeface = String(product?.type || '').toLowerCase().includes('typeface');

  if (isTypeface) {
    const previewText = variant === 'detail' ? 'Abc' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const fontFamily = getProductFontFamily(product);
    return `
      <div class="product-visual product-visual--typeface" aria-label="${product.productTitle} typeface preview">
        <div class="typeface-preview-surface">
          <span style="font-family: ${fontFamily};">${previewText}</span>
        </div>
      </div>
    `;
  }

  if (imageUrl) {
    return `
      <div class="product-visual product-visual--image" aria-label="${product.productTitle} preview">
        <img src="${imageUrl}" alt="${product.productTitle}" />
      </div>
    `;
  }

  return `<div class="product-visual" aria-label="${product.productTitle} preview"></div>`;
}

function getProductFontFamily(product) {
  const source = (product?.fontFamily || product?.productTitle || product?.type || '').toLowerCase();
  if (source.includes('jetbrains') || source.includes('mono')) return "'JetBrains Mono', monospace";
  if (source.includes('clash')) return "'Clash Display', sans-serif";
  if (source.includes('octane') || source.includes('high')) return "'High Octane', sans-serif";
  return "'Clash Display', sans-serif";
}

function isProductAvailable(product) {
  if (!product) return false;
  const stockText = String(product.inStockFlag || '').toLowerCase();
  const units = Number(product.units || 0);
  return !stockText.includes('out') && units > 0;
}

function bindQuantityStepper(container) {
  const steppers = container.querySelectorAll('.qty-stepper');
  steppers.forEach((stepper) => {
    const input = stepper.querySelector('.qty-input');
    const minus = stepper.querySelector('[data-qty-action="decrement"]');
    const plus = stepper.querySelector('[data-qty-action="increment"]');
    if (!input) return;

    const setNextValue = (nextValue) => {
      const min = Number(input.min || 1);
      const max = Number(input.max || 99);
      const clamped = Math.min(Math.max(min, nextValue), max);
      input.value = String(clamped);
    };

    minus?.addEventListener('click', () => setNextValue(Number(input.value || 1) - 1));
    plus?.addEventListener('click', () => setNextValue(Number(input.value || 1) + 1));
  });
}

function getCartItems() {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
async function loadProducts() {
  if (window.NOVA_PRODUCTS && window.NOVA_PRODUCTS.length) {
    return window.NOVA_PRODUCTS;
  }
}

function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
  const response = await fetch(resolveProductDataPath());
  if (!response.ok) {
    throw new Error('Unable to load product data');
  }

function resolveSiteRootPath() {
  const pathname = window.location.pathname;
  if (pathname.includes('/shop/products/')) return '../../';
  if (pathname.includes('/shop/categories/')) return '../../';
  if (pathname.includes('/shop/collections/')) return '../../';
  if (pathname.includes('/shop/')) return '../';
  return './';
  const payload = await response.json();
  const products = Array.isArray(payload.products) ? payload.products : [];
  window.NOVA_PRODUCTS = products;
  return products;
}

async function ensureProductsLoaded() {
  if (!window.NOVA_PRODUCTS || !window.NOVA_PRODUCTS.length) {
    window.NOVA_PRODUCTS = await loadProducts();
  if (typeof window.ensureProductsLoaded === 'function') {
    return window.ensureProductsLoaded();
  }
  return window.NOVA_PRODUCTS;
  return loadProducts();
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getProductById(productId) {
  return (window.NOVA_PRODUCTS || []).find((product) => product.id === productId) || null;
}

async function addToCart(productId, quantity = 1) {
  const products = window.NOVA_PRODUCTS && window.NOVA_PRODUCTS.length ? window.NOVA_PRODUCTS : await loadProducts();
  const product = products.find((entry) => entry.id === productId) || null;
  if (!product || !isProductAvailable(product)) return;
/* --------------------------------------------------------------------------
   Catalog & Archive Rendering
   -------------------------------------------------------------------------- */

  const requested = Math.max(1, Math.floor(Number(quantity) || 1));
  const maxUnits = Number(product.units || 0);
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
  if (document.body.dataset.page === 'checkout') {
    renderCheckoutSummary();
  }
function normalizeFilterValue(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function removeFromCart(productId) {
  const nextItems = getCartItems().filter((entry) => entry.id !== productId);
  saveCartItems(nextItems);
  renderCartDrawer();
  if (document.body.dataset.page === 'checkout') {
    renderCheckoutSummary();
  }
}
function matchesArchiveFilter(product, filterKey, filterValue) {
  if (!filterKey || !filterValue) return true;

async function renderCartDrawer() {
  const panel = document.querySelector('.cart-panel');
  if (!panel) return;
  const actualValue = normalizeFilterValue(product[filterKey]);
  const targetValue = normalizeFilterValue(filterValue);

  const items = getCartItems();
  const list = panel.querySelector('.cart-items');
  const total = panel.querySelector('.cart-total strong');
  const count = panel.querySelector('.cart-count');
  if (!actualValue || !targetValue) return false;
  if (actualValue === targetValue) return true;

  if (!list || !total || !count) return;
  if (filterKey === 'category') {
    const aliases = {
      posters: ['posters', 'poster', 'prints', 'print', 'posters prints', 'poster prints'],
      wallpapers: ['wallpapers', 'wallpaper', 'digital downloads', 'desktop wallpaper', 'phone screen wallpaper', 'digital wallpaper'],
      typefaces: ['typefaces', 'typeface', 'assets', 'font', 'fonts'],
      bundles: ['bundles', 'bundle'],
      services: ['services', 'service', 'commission', 'commissions']
    };

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
    const lookup = aliases[targetValue] || [targetValue];
    return lookup.some((alias) => actualValue === alias || actualValue.includes(alias) || alias.includes(actualValue));
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

  list.innerHTML = entries.map((item) => `
    <div class="cart-item">
      <div class="cart-item-visual" aria-hidden="true"></div>
      <div class="cart-item-copy">
        <strong>${item.productTitle}</strong>
        <span>qty: ${item.quantity}</span>
      </div>
      <div class="cart-item-total">${formatMoney(item.lineTotal)}</div>
    </div>
  `).join('');

  total.textContent = formatMoney(subtotal);
  count.textContent = `${entries.reduce((sum, item) => sum + item.quantity, 0)} items`;
  return actualValue.includes(targetValue) || targetValue.includes(actualValue);
}

function renderProductCard(product) {
  const detailLink = `${resolveSiteRootPath()}product-detail.html?id=${encodeURIComponent(product.id)}`;
  const available = isProductAvailable(product);
  const maxUnits = Math.max(1, Number(product.units || 1));

  return `
    <article class="product-card liquid-panel">
      ${renderProductVisual(product, 'card')}
      <div class="product-card-copy">
        <h3>${product.productTitle}</h3>
        <div class="product-meta">
          <span>${product.category}</span>
          <span>${product.type}</span>
        </div>
      </div>
      <div class="product-card-actions">
        <span class="product-price">${formatMoney(product.productPrice)}</span>
        <div class="qty-stepper" aria-label="Quantity selector for ${product.productTitle}">
          <button type="button" class="qty-step" data-qty-action="decrement" aria-label="Decrease quantity">-</button>
          <input class="qty-input" type="number" min="1" max="${maxUnits}" value="1" ${available ? '' : 'disabled'} />
          <button type="button" class="qty-step" data-qty-action="increment" aria-label="Increase quantity">+</button>
        </div>
        <button class="secondary-button add-to-cart" type="button" data-product-id="${product.id}" ${available ? '' : 'disabled'}>${available ? 'add to cart' : 'unavailable :('}</button>
      </div>
      <a class="inline-link" href="${detailLink}">view details</a>
    </article>
  `;
}

async function loadProducts() {
  if (window.NOVA_PRODUCTS && window.NOVA_PRODUCTS.length) {
    return window.NOVA_PRODUCTS;
  }

  const response = await fetch(resolveProductDataPath());
  if (!response.ok) {
    throw new Error('Unable to load product data');
  }

  const payload = await response.json();
  const products = Array.isArray(payload.products) ? payload.products : [];
  window.NOVA_PRODUCTS = products;
  return products;
}

function normalizeFilterValue(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function matchesArchiveFilter(product, filterKey, filterValue) {
  if (!filterKey || !filterValue) return true;

  const actualValue = normalizeFilterValue(product[filterKey]);
  const targetValue = normalizeFilterValue(filterValue);

  if (!actualValue || !targetValue) return false;
  if (actualValue === targetValue) return true;

  if (filterKey === 'category') {
    const aliases = {
      posters: ['posters', 'poster', 'prints', 'print', 'posters prints', 'poster prints'],
      wallpapers: ['wallpapers', 'wallpaper', 'digital downloads', 'desktop wallpaper', 'phone screen wallpaper', 'digital wallpaper'],
      typefaces: ['typefaces', 'typeface', 'assets', 'font', 'fonts'],
      bundles: ['bundles', 'bundle'],
      services: ['services', 'service', 'commission', 'commissions']
    };

    const lookup = aliases[targetValue] || [targetValue];
    return lookup.some((alias) => actualValue === alias || actualValue.includes(alias) || alias.includes(actualValue));
  }

  return actualValue.includes(targetValue) || targetValue.includes(actualValue);
}

function buildArchivePage() {
  const productGrid = document.querySelector('#product-grid');
  if (!productGrid) return;

  const pageType = document.body.dataset.pageType || 'catalog';
  const filterKey = document.body.dataset.filterKey || '';
  const filterValue = document.body.dataset.filterValue || '';

  loadProducts().then((products) => {
    let filtered = products;

    if (filterKey && filterValue) {
      filtered = products.filter((product) => matchesArchiveFilter(product, filterKey, filterValue));
    }

    productGrid.innerHTML = filtered.map(renderProductCard).join('');
    bindQuantityStepper(productGrid);

    productGrid.querySelectorAll('.add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
        const stepper = button.closest('.product-card')?.querySelector('.qty-input');
        const quantity = stepper ? Number(stepper.value || 1) : 1;
        addToCart(button.dataset.productId, quantity);
        if (typeof window.addToCart === 'function') {
          window.addToCart(button.dataset.productId, quantity);
        }
      });
    });

    if (typeof window.bindInteractiveMotion === 'function') {
      window.bindInteractiveMotion('.product-card');
    }
  }).catch(() => {
    productGrid.innerHTML = '<p>product catalog unavailable.</p>';
  });
}

/* --------------------------------------------------------------------------
   Product Page (from static template with data-product-id)
   -------------------------------------------------------------------------- */

function renderProductPageFromData() {
  const root = document.querySelector('#product-page-root');
  const productId = document.body.dataset.productId;
  if (!root || !productId) return;

  loadProducts().then((products) => {
    const product = products.find((entry) => entry.id === productId) || null;
    if (!product) {
      root.innerHTML = '<p>this product could not be found.</p>';
      return;
    }

    const hasTypeface = String(product.type || '').toLowerCase().includes('typeface');
    const hasResolution = Boolean(product.resolution);
    const hasRatio = Boolean(product.ratio);
    const ratioValues = product.ratio ? product.ratio.split('&').map((entry) => entry.trim()).filter(Boolean) : [];
    const ratioButtons = ratioValues.length > 1
      ? ratioValues.map((ratio, index) => `<button type="button" class="option-button ${index === 0 ? 'is-active' : ''}">${ratio}</button>`).join('')
      : (hasRatio ? `<button type="button" class="option-button is-active">${product.ratio}</button>` : '');

    const typefaceSample = hasTypeface ? `
      <div class="product-option-block">
        <label class="input-label" for="font-sample-text">sample text</label>
        <input id="font-sample-text" class="font-sample-input" type="text" value="Nova Genesis" />
        <div class="typeface-sample-box" style="font-family: ${getProductFontFamily(product)};">Nova Genesis</div>
      </div>
    ` : '';
    const productTitleClass = hasTypeface ? 'detail-title detail-title--typeface' : 'detail-title';
    const productTitleStyle = hasTypeface ? `style="font-family: ${getProductFontFamily(product)};"` : '';
    const available = isProductAvailable(product);
    const quantityMarkup = `
      <div class="qty-stepper qty-stepper--detail" aria-label="Quantity selector for ${product.productTitle}">
        <button type="button" class="qty-step" data-qty-action="decrement" aria-label="Decrease quantity">-</button>
        <input class="qty-input product-quantity-input" type="number" min="1" max="${Math.max(1, Number(product.units || 1))}" value="1" ${available ? '' : 'disabled'} />
        <button type="button" class="qty-step" data-qty-action="increment" aria-label="Increase quantity">+</button>
      </div>
    `;

    const resolutionMarkup = hasResolution ? `
      <div class="product-option-block">
        <span class="input-label">resolution</span>
        <div class="product-option-list">
          <button type="button" class="option-button is-active">${product.resolution}</button>
        </div>
      </div>
    ` : '';

    const ratioMarkup = hasRatio ? `
      <div class="product-option-block">
        <span class="input-label">aspect ratio</span>
        <div class="product-option-list">${ratioButtons}</div>
      </div>
    ` : '';

    root.innerHTML = `
      <div class="product-page-shell">
        <div class="detail-panel liquid-panel product-media-panel">
          ${renderProductVisual(product, 'detail')}
        </div>
        <div class="detail-panel liquid-panel product-summary-panel">
          <div class="eyebrow">${product.deliveryType}</div>
          <h1 class="${productTitleClass}" ${productTitleStyle}>${product.productTitle}</h1>
          <div class="detail-price">${formatMoney(product.productPrice)}</div>
          <p class="product-description">${product.description}</p>
          <ul class="detail-meta-list">
            <li><span>delivery</span><strong>${product.deliveryTime}</strong></li>
            <li><span>units</span><strong>${product.units}</strong></li>
            <li><span>category</span><strong>${product.category}</strong></li>
            <li><span>collection</span><strong>${product.collection || 'general'}</strong></li>
            <li><span>type</span><strong>${product.type}</strong></li>
            <li><span>stock</span><strong>${formatStockLabel(product.inStockFlag)}</strong></li>
            ${product.canvasSize ? `<li><span>canvas size</span><strong>${product.canvasSize}</strong></li>` : ''}
            ${product.commissionType ? `<li><span>commission type</span><strong>${product.commissionType}</strong></li>` : ''}
          </ul>
          ${resolutionMarkup}
          ${ratioMarkup}
          ${typefaceSample ? typefaceSample : ''}
          <div class="form-actions form-actions--stacked">
            ${quantityMarkup}
            <button class="primary-button add-to-cart" type="button" data-product-id="${product.id}" ${available ? '' : 'disabled'}>${available ? 'add to cart' : 'unavailable :('}</button>
          </div>
        </div>
      </div>
    `;

    bindQuantityStepper(root);

    const actionButton = root.querySelector('.add-to-cart');
    if (actionButton) {
      actionButton.addEventListener('click', () => {
        const quantityInput = root.querySelector('.product-quantity-input');
        const quantity = quantityInput ? Number(quantityInput.value || 1) : 1;
        addToCart(product.id, quantity);
        if (typeof window.addToCart === 'function') {
          window.addToCart(product.id, quantity);
        }
      });
    }

    if (typeof window.bindInteractiveMotion === 'function') {
      window.bindInteractiveMotion('.detail-panel');
    }
  }).catch(() => {
    root.innerHTML = '<p>this product could not be found.</p>';
  });
}

/* --------------------------------------------------------------------------
   Product Detail Page (dynamic query ?id=...)
   -------------------------------------------------------------------------- */

function renderProductDetailPage() {
  const detailRoot = document.querySelector('#product-detail');
  if (!detailRoot) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  loadProducts().then((products) => {
    const product = products.find((item) => item.id === productId) || products[0];
    if (!product) {
      detailRoot.innerHTML = '<p>this product could not be found.</p>';
      return;
    }

    const related = products.filter((item) => item.collection === product.collection && item.id !== product.id).slice(0, 3);
    const hasTypeface = String(product.type || '').toLowerCase().includes('typeface');
    const typefaceSample = hasTypeface ? `
      <div class="product-option-block">
        <label class="input-label" for="font-sample-text">sample text</label>
        <input id="font-sample-text" class="font-sample-input" type="text" value="Nova Genesis" />
        <div class="typeface-sample-box" style="font-family: ${getProductFontFamily(product)};">Nova Genesis</div>
      </div>
    ` : '';

    const detailTitleClass = hasTypeface ? 'detail-title detail-title--typeface' : 'detail-title';
    const detailTitle = hasTypeface ? 'style="font-family: ' + getProductFontFamily(product) + ';"' : '';
    const available = isProductAvailable(product);
    const quantityMarkup = `
      <div class="qty-stepper qty-stepper--detail" aria-label="Quantity selector for ${product.productTitle}">
        <button type="button" class="qty-step" data-qty-action="decrement" aria-label="Decrease quantity">-</button>
        <input class="qty-input product-quantity-input" type="number" min="1" max="${Math.max(1, Number(product.units || 1))}" value="1" ${available ? '' : 'disabled'} />
        <button type="button" class="qty-step" data-qty-action="increment" aria-label="Increase quantity">+</button>
      </div>
    `;

    detailRoot.innerHTML = `
      <div class="detail-layout">
        <div class="detail-panel liquid-panel">
          ${renderProductVisual(product, 'detail')}
        </div>
        <div class="detail-panel liquid-panel detail-content">
          <div class="eyebrow">${product.deliveryType}</div>
          <h1 class="${detailTitleClass}" ${detailTitle}>${product.productTitle}</h1>
          <div class="detail-price">${formatMoney(product.productPrice)}</div>
          <p>${product.description}</p>
          <ul class="detail-meta-list">
            <li><span>delivery</span><strong>${product.deliveryTime}</strong></li>
            <li><span>units</span><strong>${product.units}</strong></li>
            <li><span>category</span><strong>${product.category}</strong></li>
            <li><span>collection</span><strong>${product.collection || 'general'}</strong></li>
            <li><span>type</span><strong>${product.type}</strong></li>
            <li><span>stock</span><strong>${formatStockLabel(product.inStockFlag)}</strong></li>
            ${product.canvasSize ? `<li><span>canvas size</span><strong>${product.canvasSize}</strong></li>` : ''}
            ${product.resolution ? `<li><span>resolution</span><strong>${product.resolution}</strong></li>` : ''}
            ${product.ratio ? `<li><span>ratio</span><strong>${product.ratio}</strong></li>` : ''}
            ${product.commissionType ? `<li><span>commission type</span><strong>${product.commissionType}</strong></li>` : ''}
          </ul>
          ${typefaceSample ? typefaceSample : ''}
          <div class="form-actions form-actions--stacked">
            ${quantityMarkup}
            <button class="primary-button add-to-cart" type="button" data-product-id="${product.id}" ${available ? '' : 'disabled'}>${available ? 'add to cart' : 'unavailable :('}</button>
          </div>
        </div>
      </div>
      <div class="detail-panel liquid-panel similar-panel">
        <div class="eyebrow">similar pieces</div>
        <div class="archive-grid">
          ${related.length ? related.map(renderProductCard).join('') : '<p>no similar products available right now.</p>'}
        </div>
      </div>
    `;

    bindQuantityStepper(detailRoot);

    detailRoot.querySelectorAll('.add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
        const input = detailRoot.querySelector('.product-quantity-input');
        const quantity = input ? Number(input.value || 1) : 1;
        addToCart(button.dataset.productId, quantity);
        if (typeof window.addToCart === 'function') {
          window.addToCart(button.dataset.productId, quantity);
        }
      });
    });

    if (typeof window.bindInteractiveMotion === 'function') {
      window.bindInteractiveMotion('.detail-panel, .product-card');
    }
  }).catch(() => {
    detailRoot.innerHTML = '<p>product info unavailable.</p>';
  });
}

/* --------------------------------------------------------------------------
   Checkout Summary & Checkout Form Handling
   -------------------------------------------------------------------------- */

async function renderCheckoutSummary() {
  const summaryRoot = document.querySelector('#checkout-summary');
  if (!summaryRoot) return;

  const items = getCartItems();
  const items = typeof window.getCartItems === 'function' ? window.getCartItems() : [];
  if (!items.length) {
    summaryRoot.innerHTML = `
      <div class="empty-cart">
        <strong>your cart is empty.</strong>
        <span>add a piece before checkout.</span>
      </div>
    `;
    return;
  }

  const products = await ensureProductsLoaded();
  const entries = items
    .map((entry) => {
      const product = products.find((item) => item.id === entry.id);
      if (!product) return null;
      return { ...product, quantity: entry.quantity, lineTotal: Number(product.productPrice) * entry.quantity };
    })
    .filter(Boolean);

  const subtotal = entries.reduce((sum, item) => sum + item.lineTotal, 0);
  const total = subtotal;

  summaryRoot.innerHTML = `
    <div class="summary-list">
      ${entries.map((item) => `
        <div class="summary-item">
          <span>${item.productTitle} x${item.quantity}</span>
          <strong>${formatMoney(item.lineTotal)}</strong>
        </div>
      `).join('')}
    </div>
    <div class="summary-total">
      <span>total</span>
      <strong>${formatMoney(total)}</strong>
    </div>
  `;
}

async function initializeCheckoutForm() {
  const form = document.querySelector('#checkout-form');
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const cardInput = form.querySelector('input[name="card"]');
  const expiryInput = form.querySelector('input[name="expiry"]');
  const cvcInput = form.querySelector('input[name="cvc"]');
  const shippingPanel = form.querySelector('.shipping-panel');
  const shippingSameAsBilling = form.querySelector('#shipping-same-as-billing');
  const billingAddress = form.querySelector('input[name="address"]');
  const billingAddress2 = form.querySelector('input[name="address_2"]');
  const billingCity = form.querySelector('input[name="city"]');
  const billingCountry = form.querySelector('input[name="country"]');
  const billingZip = form.querySelector('input[name="zip"]');

  const formatCardNumber = (value) => value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  cardInput?.addEventListener('input', (event) => {
    event.target.value = formatCardNumber(event.target.value);
  });

  expiryInput?.addEventListener('input', (event) => {
    event.target.value = formatExpiry(event.target.value);
  });

  cvcInput?.addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4);
  });

  const products = await ensureProductsLoaded();
  const items = typeof window.getCartItems === 'function' ? window.getCartItems() : [];
  const hasPhysicalItems = items.some((entry) => {
    const product = products.find((item) => item.id === entry.id);
    return product && String(product.deliveryType).toLowerCase() === 'physical';
  });

  if (shippingPanel) {
    shippingPanel.classList.toggle('is-visible', hasPhysicalItems);
  }

  if (shippingSameAsBilling) {
    const syncShippingFields = () => {
      const shippingInputs = shippingPanel?.querySelectorAll('input') || [];
      shippingInputs.forEach((field) => {
        field.disabled = shippingSameAsBilling.checked;
      });

      if (shippingSameAsBilling.checked) {
        const shippingAddress = form.querySelector('input[name="shipping_address"]');
        const shippingAddress2 = form.querySelector('input[name="shipping_address_2"]');
        const shippingCity = form.querySelector('input[name="shipping_city"]');
        const shippingCountry = form.querySelector('input[name="shipping_country"]');
        const shippingZip = form.querySelector('input[name="shipping_zip"]');

        if (shippingAddress) shippingAddress.value = billingAddress?.value || '';
        if (shippingAddress2) shippingAddress2.value = billingAddress2?.value || '';
        if (shippingCity) shippingCity.value = billingCity?.value || '';
        if (shippingCountry) shippingCountry.value = billingCountry?.value || '';
        if (shippingZip) shippingZip.value = billingZip?.value || '';
      }
    };

    shippingSameAsBilling.addEventListener('change', syncShippingFields);
    syncShippingFields();
  }

  const copyShippingButton = form.querySelector('#copy-billing-to-shipping');
  copyShippingButton?.addEventListener('click', () => {
    const shippingAddress = form.querySelector('input[name="shipping_address"]');
    const shippingAddress2 = form.querySelector('input[name="shipping_address_2"]');
    const shippingCity = form.querySelector('input[name="shipping_city"]');
    const shippingCountry = form.querySelector('input[name="shipping_country"]');
    const shippingZip = form.querySelector('input[name="shipping_zip"]');

    if (shippingAddress) shippingAddress.value = billingAddress?.value || '';
    if (shippingAddress2) shippingAddress2.value = billingAddress2?.value || '';
    if (shippingCity) shippingCity.value = billingCity?.value || '';
    if (shippingCountry) shippingCountry.value = billingCountry?.value || '';
    if (shippingZip) shippingZip.value = billingZip?.value || '';
  });

  if (!items.length && button) {
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const currentItems = typeof window.getCartItems === 'function' ? window.getCartItems() : [];
    if (!currentItems.length) {
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (cardInput && cardInput.value.replace(/\D/g, '').length < 15) {
      cardInput.focus();
      return;
    }

    if (expiryInput) {
      const [month, year] = (expiryInput.value || '').split('/');
      const monthNum = Number(month);
      const yearNum = Number(year);
      const now = new Date();
      const nowYear = now.getFullYear() % 100;

      if (!month || !year || monthNum < 1 || monthNum > 12 || Number.isNaN(yearNum) || yearNum < nowYear) {
        expiryInput.focus();
        return;
      }
    }

    if (cvcInput && cvcInput.value.replace(/\D/g, '').length < 3) {
      cvcInput.focus();
      return;
    }

    const orderId = 'NG-' + Math.floor(100000 + Math.random() * 900000);
    const orderKey = window.ORDER_KEY || 'nova-genesis-order';

    localStorage.setItem(orderKey, JSON.stringify({
      orderId,
      email: payload.email,
      items: currentItems,
      createdAt: new Date().toISOString(),
    }));

    window.location.href = `order-confirmation.html?order_id=${orderId}`;
  });
}

/* --------------------------------------------------------------------------
   Order Confirmation
   -------------------------------------------------------------------------- */

async function renderOrderConfirmation() {
  const container = document.querySelector('#order-confirmation');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order_id') || 'NG-000000';
  const order = JSON.parse(localStorage.getItem(ORDER_KEY) || '{}');
  const orderItems = order.items || getCartItems();
  const orderKey = window.ORDER_KEY || 'nova-genesis-order';
  const order = JSON.parse(localStorage.getItem(orderKey) || '{}');
  const orderItems = order.items || (typeof window.getCartItems === 'function' ? window.getCartItems() : []);
  const products = await ensureProductsLoaded();

  const entries = orderItems
    .map((entry) => {
      const product = products.find((item) => item.id === entry.id);
      if (!product) return null;
      return { ...product, quantity: entry.quantity, lineTotal: Number(product.productPrice) * entry.quantity };
    })
    .filter(Boolean);

  const total = entries.reduce((sum, item) => sum + item.lineTotal, 0);

  container.innerHTML = `
    <div class="confirmation-card liquid-panel">
      <div class="eyebrow">order complete</div>
      <h1>thank you for your purchase.</h1>
      <p>order no. <strong>${orderId}</strong></p>
      <p>your confirmation has been sent to ${order.email || 'your inbox'}.</p>
      <div class="summary-list">
        ${entries.map((item) => `
          <div class="summary-item">
            <span>${item.productTitle} x${item.quantity}</span>
            <strong>${formatMoney(item.lineTotal)}</strong>
          </div>
        `).join('')}
      </div>
      <div class="summary-total">
        <span>total</span>
        <strong>${formatMoney(total)}</strong>
      </div>
      <div class="download-list">
        ${entries.filter((item) => item.deliveryType === 'Digital').map((item) => `
          <a href="#" aria-label="Download ${item.productTitle}">download ${item.productTitle}</a>
        `).join('')}
        `).join('') || '<span>your downloads will be shared via email.</span>'}
      </div>
      <a class="primary-button" href="./index.html">back home</a>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   Storefront Initialization
   -------------------------------------------------------------------------- */

function initStorefront() {
  const root = document.querySelector('#product-grid');
  const productPageRoot = document.querySelector('#product-page-root');
  const detailPage = document.querySelector('#product-detail');
  const checkoutSummary = document.querySelector('#checkout-summary');
  const checkoutForm = document.querySelector('#checkout-form');
  const confirmation = document.querySelector('#order-confirmation');

  if (root) buildArchivePage();
  if (productPageRoot) renderProductPageFromData();
  if (detailPage) renderProductDetailPage();
  if (checkoutSummary) renderCheckoutSummary();
  if (checkoutForm) initializeCheckoutForm();
  if (confirmation) renderOrderConfirmation();
  renderCartDrawer();

  if (typeof window.bindInteractiveMotion === 'function') {
    window.bindInteractiveMotion('.product-card, .detail-panel, .commission-card');
  }
}

window.renderCheckoutSummary = renderCheckoutSummary;
window.renderOrderConfirmation = renderOrderConfirmation;

document.addEventListener('DOMContentLoaded', initStorefront);
