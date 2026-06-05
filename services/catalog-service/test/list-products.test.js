import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ListAvailableProducts } from '../src/application/ListAvailableProducts.js';
import { InMemoryProductRepository } from '../src/infrastructure/InMemoryProductRepository.js';

describe('ListAvailableProducts', () => {
  it('returns only available products', async () => {
    const useCase = new ListAvailableProducts(new InMemoryProductRepository());

    const products = await useCase.execute();

    assert.equal(products.length, 2);
    assert.ok(products.every((product) => product.available));
  });
});
