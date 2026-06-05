export class InMemoryOrderRepository {
  constructor() {
    this.orders = [];
  }

  async save(order) {
    this.orders.push(order);
    return order;
  }

  async findAll() {
    return this.orders;
  }
}
