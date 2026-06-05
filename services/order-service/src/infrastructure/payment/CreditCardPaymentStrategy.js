export class CreditCardPaymentStrategy {
  async authorize(order) {
    return {
      approved: true,
      method: 'credit-card',
      amount: order.total
    };
  }
}
