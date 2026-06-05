import { Order } from './Order.js';

export class OrderFactory {
  create({ customerName, items, paymentMethod }) {
    return new Order({
      id: crypto.randomUUID(),
      customerName,
      items,
      paymentMethod
    });
  }
}
