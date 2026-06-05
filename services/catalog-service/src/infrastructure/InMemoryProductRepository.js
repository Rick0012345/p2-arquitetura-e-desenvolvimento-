import { Product } from '../domain/Product.js';

export class InMemoryProductRepository {
  constructor() {
    this.products = [
      new Product({ id: 'p1', name: 'Cesta Orgânica', price: 35, available: true }),
      new Product({ id: 'p2', name: 'Mel Artesanal', price: 22, available: true }),
      new Product({ id: 'p3', name: 'Queijo Colonial', price: 40, available: false })
    ];
  }

  async findAll() {
    return this.products;
  }
}
