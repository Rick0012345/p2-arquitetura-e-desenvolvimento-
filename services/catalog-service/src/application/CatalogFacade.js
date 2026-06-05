export class CatalogFacade {
  constructor(listAvailableProducts) {
    this.listAvailableProducts = listAvailableProducts;
  }

  async listProducts() {
    return this.listAvailableProducts.execute();
  }
}
