const apiHost = window.location.hostname || 'localhost';
const apiProtocol = window.location.protocol || 'http:';

const endpoints = {
  catalog: `${apiProtocol}//${apiHost}:3001`,
  orders: `${apiProtocol}//${apiHost}:3002`,
  notifications: `${apiProtocol}//${apiHost}:3003`
};

const state = {
  products: [],
  cart: new Map()
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const elements = {
  productList: document.querySelector('#productList'),
  cartList: document.querySelector('#cartList'),
  cartTotal: document.querySelector('#cartTotal'),
  ordersList: document.querySelector('#ordersList'),
  notificationList: document.querySelector('#notificationList'),
  feedback: document.querySelector('#feedback'),
  orderForm: document.querySelector('#orderForm'),
  customerName: document.querySelector('#customerName'),
  paymentMethod: document.querySelector('#paymentMethod')
};

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Nao foi possivel concluir a operacao.');
  }

  return data;
}

function setServiceStatus(id, isOnline) {
  const element = document.querySelector(id);
  element.classList.toggle('online', isOnline);
  element.classList.toggle('offline', !isOnline);
}

async function checkServices() {
  const checks = [
    ['#catalogStatus', `${endpoints.catalog}/health`],
    ['#orderStatus', `${endpoints.orders}/health`],
    ['#notificationStatus', `${endpoints.notifications}/health`]
  ];

  await Promise.all(
    checks.map(async ([id, url]) => {
      try {
        await requestJson(url);
        setServiceStatus(id, true);
      } catch {
        setServiceStatus(id, false);
      }
    })
  );
}

async function loadProducts() {
  try {
    state.products = await requestJson(`${endpoints.catalog}/products`);
    renderProducts();
  } catch (error) {
    elements.productList.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

function renderProducts() {
  elements.productList.innerHTML = state.products
    .map((product) => {
      const disabled = product.available ? '' : 'disabled';
      const helper = product.available ? formatCurrency(product.price) : 'Indisponivel';

      return `
        <article class="product-card">
          <div>
            <h3>${product.name}</h3>
            <span class="muted">${helper}</span>
          </div>
          <button class="add-button" data-product-id="${product.id}" ${disabled} title="Adicionar produto">+</button>
        </article>
      `;
    })
    .join('');
}

function renderCart() {
  const items = [...state.cart.values()];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  elements.cartTotal.textContent = formatCurrency(total);

  if (items.length === 0) {
    elements.cartList.innerHTML = '<div class="empty-state">Adicione produtos do catalogo para montar o pedido.</div>';
    return;
  }

  elements.cartList.innerHTML = items
    .map(
      (item) => `
        <article class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <div class="muted">${formatCurrency(item.price)} cada</div>
          </div>
          <div class="quantity-control">
            <button type="button" data-decrease="${item.id}" title="Diminuir quantidade">-</button>
            <strong>${item.quantity}</strong>
            <button type="button" data-increase="${item.id}" title="Aumentar quantidade">+</button>
          </div>
          <strong>${formatCurrency(item.price * item.quantity)}</strong>
        </article>
      `
    )
    .join('');
}

function addProduct(productId) {
  const product = state.products.find((item) => item.id === productId);

  if (!product || !product.available) {
    return;
  }

  const current = state.cart.get(productId);
  state.cart.set(productId, {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: current ? current.quantity + 1 : 1
  });

  renderCart();
}

function changeQuantity(productId, delta) {
  const current = state.cart.get(productId);

  if (!current) {
    return;
  }

  const nextQuantity = current.quantity + delta;

  if (nextQuantity <= 0) {
    state.cart.delete(productId);
  } else {
    state.cart.set(productId, { ...current, quantity: nextQuantity });
  }

  renderCart();
}

async function submitOrder(event) {
  event.preventDefault();

  const items = [...state.cart.values()];

  if (items.length === 0) {
    elements.feedback.textContent = 'Adicione pelo menos um produto ao pedido.';
    return;
  }

  const payload = {
    customerName: elements.customerName.value.trim(),
    paymentMethod: elements.paymentMethod.value,
    items: items.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price
    }))
  };

  try {
    const order = await requestJson(`${endpoints.orders}/orders`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    await requestJson(`${endpoints.notifications}/notifications`, {
      method: 'POST',
      body: JSON.stringify({
        channel: 'internal',
        message: `Pedido ${order.id} criado para ${order.customerName}.`
      })
    });

    state.cart.clear();
    elements.orderForm.reset();
    elements.feedback.textContent = `Pedido ${order.id} enviado com sucesso.`;
    renderCart();
    await Promise.all([loadOrders(), loadNotifications()]);
  } catch (error) {
    elements.feedback.textContent = error.message;
  }
}

async function loadOrders() {
  try {
    const orders = await requestJson(`${endpoints.orders}/orders`);

    if (orders.length === 0) {
      elements.ordersList.innerHTML = '<div class="empty-state">Nenhum pedido criado ainda.</div>';
      return;
    }

    elements.ordersList.innerHTML = orders
      .slice()
      .reverse()
      .map(
        (order) => `
          <article class="timeline-item">
            <h3>${order.customerName}</h3>
            <div class="muted">${order.items.length} item(ns) · ${order.paymentMethod}</div>
            <strong>${formatCurrency(order.total)}</strong>
          </article>
        `
      )
      .join('');
  } catch (error) {
    elements.ordersList.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

async function loadNotifications() {
  try {
    const notifications = await requestJson(`${endpoints.notifications}/notifications`);

    if (notifications.length === 0) {
      elements.notificationList.innerHTML = '<div class="empty-state">Nenhuma notificacao registrada ainda.</div>';
      return;
    }

    elements.notificationList.innerHTML = notifications
      .slice()
      .reverse()
      .map(
        (notification) => `
          <article class="notification-item">
            <strong>${notification.channel}</strong>
            <p class="muted">${notification.message}</p>
            <span class="muted">${new Date(notification.createdAt).toLocaleString('pt-BR')}</span>
          </article>
        `
      )
      .join('');
  } catch (error) {
    elements.notificationList.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

elements.productList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-product-id]');

  if (button) {
    addProduct(button.dataset.productId);
  }
});

elements.cartList.addEventListener('click', (event) => {
  const increase = event.target.closest('[data-increase]');
  const decrease = event.target.closest('[data-decrease]');

  if (increase) {
    changeQuantity(increase.dataset.increase, 1);
  }

  if (decrease) {
    changeQuantity(decrease.dataset.decrease, -1);
  }
});

document.querySelector('#refreshProducts').addEventListener('click', loadProducts);
document.querySelector('#refreshOrders').addEventListener('click', loadOrders);
document.querySelector('#refreshNotifications').addEventListener('click', loadNotifications);
elements.orderForm.addEventListener('submit', submitOrder);

renderCart();
await Promise.all([checkServices(), loadProducts(), loadOrders(), loadNotifications()]);
