import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CreateOrderUseCase } from '../src/application/CreateOrderUseCase.js';
import { OrderFactory } from '../src/domain/OrderFactory.js';
import { InMemoryOrderRepository } from '../src/infrastructure/InMemoryOrderRepository.js';
import { PixPaymentStrategy } from '../src/infrastructure/payment/PixPaymentStrategy.js';

class SilentNotifier {
  async notify() {}
}

function makeUseCase(overrides = {}) {
  const orderRepository = new InMemoryOrderRepository();
  const createOrder = new CreateOrderUseCase({
    orderFactory: new OrderFactory(),
    orderRepository,
    orderCreatedNotifier: new SilentNotifier(),
    paymentStrategies: {
      pix: new PixPaymentStrategy()
    },
    ...overrides
  });

  return { createOrder, orderRepository };
}

describe('CreateOrderUseCase', () => {
  it('creates a paid order with calculated total', async () => {
    const { createOrder, orderRepository } = makeUseCase();

    const order = await createOrder.execute({
      customerName: 'Ana',
      paymentMethod: 'pix',
      items: [
        { productId: 'p1', name: 'Cesta Orgânica', quantity: 2, unitPrice: 35 },
        { productId: 'p2', name: 'Mel Artesanal', quantity: 1, unitPrice: 22 }
      ]
    });

    assert.equal(order.total, 92);
    assert.equal(order.status, 'PAID');
    assert.equal((await orderRepository.findAll()).length, 1);
  });

  it('rejects an order without items', async () => {
    const { createOrder } = makeUseCase();

    await assert.rejects(
      () => createOrder.execute({ customerName: 'Ana', paymentMethod: 'pix', items: [] }),
      /at least one item/
    );
  });

  it('rejects unsupported payment methods', async () => {
    const { createOrder } = makeUseCase();

    await assert.rejects(
      () =>
        createOrder.execute({
          customerName: 'Ana',
          paymentMethod: 'cash',
          items: [{ productId: 'p1', name: 'Cesta Orgânica', quantity: 1, unitPrice: 35 }]
        }),
      /Unsupported payment method/
    );
  });
});
