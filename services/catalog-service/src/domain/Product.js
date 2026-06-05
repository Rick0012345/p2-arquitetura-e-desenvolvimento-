export class Product {
  constructor({ id, name, price, available }) {
    if (!id) throw new Error('Product id is required');
    if (!name) throw new Error('Product name is required');
    if (price <= 0) throw new Error('Product price must be positive');

    this.id = id;
    this.name = name;
    this.price = price;
    this.available = Boolean(available);
  }
}
