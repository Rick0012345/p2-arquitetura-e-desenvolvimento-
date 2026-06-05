export class PixPaymentStrategy {
  async authorize(order) {
    return {
      approved: true,
      method: 'pix',
      amount: order.total
    };
  }
}
