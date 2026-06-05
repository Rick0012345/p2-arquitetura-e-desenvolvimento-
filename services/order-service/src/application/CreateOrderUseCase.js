export class CreateOrderUseCase {
  constructor({ orderFactory, orderRepository, paymentStrategies, orderCreatedNotifier }) {
    this.orderFactory = orderFactory;
    this.orderRepository = orderRepository;
    this.paymentStrategies = paymentStrategies;
    this.orderCreatedNotifier = orderCreatedNotifier;
  }

  async execute(input) {
    const order = this.orderFactory.create(input);
    const paymentStrategy = this.paymentStrategies[order.paymentMethod];

    if (!paymentStrategy) {
      throw new Error(`Unsupported payment method: ${order.paymentMethod}`);
    }

    await paymentStrategy.authorize(order);
    order.markAsPaid();
    await this.orderRepository.save(order);
    await this.orderCreatedNotifier.notify(order);

    return order;
  }
}
