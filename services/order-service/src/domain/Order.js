export class Order {
  constructor({ id, customerName, items, paymentMethod }) {
    if (!id) throw new Error('Order id is required');
    if (!customerName) throw new Error('Customer name is required');
    if (!Array.isArray(items) || items.length === 0) throw new Error('Order must have at least one item');

    this.id = id;
    this.customerName = customerName;
    this.items = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }));
    this.paymentMethod = paymentMethod;
    this.status = 'CREATED';
    this.total = this.calculateTotal();
  }

  calculateTotal() {
    return this.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  }

  markAsPaid() {
    this.status = 'PAID';
  }
}
