import http from 'node:http';
import { CatalogFacade } from '../application/CatalogFacade.js';
import { ListAvailableProducts } from '../application/ListAvailableProducts.js';
import { InMemoryProductRepository } from '../infrastructure/InMemoryProductRepository.js';
import { sendJson } from './http.js';

const port = process.env.PORT || 3001;
const repository = new InMemoryProductRepository();
const listAvailableProducts = new ListAvailableProducts(repository);
const catalog = new CatalogFacade(listAvailableProducts);

const server = http.createServer(async (request, response) => {
  if (request.url === '/health') {
    return sendJson(response, 200, { status: 'ok', service: 'catalog-service' });
  }

  if (request.method === 'GET' && request.url === '/products') {
    const products = await catalog.listProducts();
    return sendJson(response, 200, products);
  }

  return sendJson(response, 404, { error: 'Route not found' });
});

server.listen(port, () => {
  console.log(`catalog-service running on port ${port}`);
});
