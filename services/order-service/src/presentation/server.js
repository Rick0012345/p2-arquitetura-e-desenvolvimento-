import http from 'node:http';
import { CreateOrderUseCase } from '../application/CreateOrderUseCase.js';
import { ListOrdersUseCase } from '../application/ListOrdersUseCase.js';
import { OrderFactory } from '../domain/OrderFactory.js';
import { ConsoleOrderObserver } from '../infrastructure/ConsoleOrderObserver.js';
import { InMemoryOrderRepository } from '../infrastructure/InMemoryOrderRepository.js';
import { OrderCreatedNotifier } from '../infrastructure/OrderCreatedNotifier.js';
import { CreditCardPaymentStrategy } from '../infrastructure/payment/CreditCardPaymentStrategy.js';
import { PixPaymentStrategy } from '../infrastructure/payment/PixPaymentStrategy.js';
import { readJson, sendJson } from './http.js';

const port = process.env.PORT || 3002;
const orderRepository = new InMemoryOrderRepository();
const orderCreatedNotifier = new OrderCreatedNotifier([new ConsoleOrderObserver()]);
const createOrder = new CreateOrderUseCase({
  orderFactory: new OrderFactory(),
  orderRepository,
  orderCreatedNotifier,
  paymentStrategies: {
    pix: new PixPaymentStrategy(),
    credit_card: new CreditCardPaymentStrategy()
  }
});
const listOrders = new ListOrdersUseCase(orderRepository);

const server = http.createServer(async (request, response) => {
  try {
    if (request.url === '/health') {
      return sendJson(response, 200, { status: 'ok', service: 'order-service' });
    }

    if (request.method === 'GET' && request.url === '/orders') {
      return sendJson(response, 200, await listOrders.execute());
    }

    if (request.method === 'POST' && request.url === '/orders') {
      const order = await createOrder.execute(await readJson(request));
      return sendJson(response, 201, order);
    }

    return sendJson(response, 404, { error: 'Route not found' });
  } catch (error) {
    return sendJson(response, 400, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`order-service running on port ${port}`);
});
