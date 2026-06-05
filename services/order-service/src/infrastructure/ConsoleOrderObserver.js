export class ConsoleOrderObserver {
  async update(order) {
    console.log(`Order ${order.id} created for ${order.customerName}`);
  }
}
