import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CreateOrderUseCase } from '../../services/order-service/src/application/CreateOrderUseCase.js';
import { OrderFactory } from '../../services/order-service/src/domain/OrderFactory.js';
import { InMemoryOrderRepository } from '../../services/order-service/src/infrastructure/InMemoryOrderRepository.js';
import { PixPaymentStrategy } from '../../services/order-service/src/infrastructure/payment/PixPaymentStrategy.js';

class BddNotifier {
  constructor() {
    this.messages = [];
  }

  async notify(order) {
    this.messages.push(`Pedido ${order.id} criado`);
  }
}

describe('BDD: criação de pedido', () => {
  it('Scenario: Cliente cria pedido válido', async () => {
    const product = { productId: 'p1', name: 'Cesta Orgânica', unitPrice: 35 };
    const notifier = new BddNotifier();
    const createOrder = new CreateOrderUseCase({
      orderFactory: new OrderFactory(),
      orderRepository: new InMemoryOrderRepository(),
      orderCreatedNotifier: notifier,
      paymentStrategies: {
        pix: new PixPaymentStrategy()
      }
    });

    const order = await createOrder.execute({
      customerName: 'Ana',
      paymentMethod: 'pix',
      items: [{ ...product, quantity: 2 }]
    });

    assert.equal(order.status, 'PAID');
    assert.equal(order.total, 70);
    assert.equal(notifier.messages.length, 1);
  });
});
