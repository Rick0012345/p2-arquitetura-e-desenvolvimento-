# FeiraConecta

FeiraConecta é uma solução fictícia para pequenos produtores venderem cestas de alimentos diretamente para clientes da região. O problema escolhido é a dificuldade de organizar catálogo, pedidos e notificações em uma operação simples, barata e publicável em nuvem.

## Link publicado

Preencha após o deploy:

- API de catálogo: `https://seu-catalog-service.onrender.com/health`
- API de pedidos: `https://seu-order-service.onrender.com/health`
- API de notificações: `https://seu-notification-service.onrender.com/health`

## Microsserviços

| Serviço | Responsabilidade | Porta |
| --- | --- | --- |
| `catalog-service` | Consulta de produtos disponíveis | `3001` |
| `order-service` | Criação e listagem de pedidos | `3002` |
| `notification-service` | Registro de notificações enviadas | `3003` |

Cada serviço possui camadas de domínio, aplicação, infraestrutura e apresentação, seguindo Arquitetura Limpa.

## Como executar localmente

```bash
npm test
docker compose up --build
```

Endpoints principais:

```bash
curl http://localhost:3001/products
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d "{\"customerName\":\"Ana\",\"items\":[{\"productId\":\"p1\",\"name\":\"Cesta Orgânica\",\"quantity\":2,\"unitPrice\":35}],\"paymentMethod\":\"pix\"}"
curl http://localhost:3003/notifications
```

## Conceitos demonstrados

- Clean Code: nomes expressivos, funções curtas, validações isoladas e ausência de lógica de negócio dentro dos controllers.
- SOLID: dependências injetadas, contratos simples, casos de uso focados e estratégias de pagamento substituíveis.
- Design Patterns: Repository, Factory, Strategy, Observer e Facade.
- TDD: testes unitários em `services/order-service/test/create-order.test.js`.
- BDD: cenário Gherkin em `tests/bdd/features/order-flow.feature` e teste executável em `tests/bdd/order-flow.test.js`.
- Docker: `Dockerfile` e `docker-compose.yml`.
- Deploy: `render.yaml` com três serviços web.

## Documentação

- [Problema e solução](docs/problema-e-solucao.md)
- [Arquitetura e decisões técnicas](docs/arquitetura.md)
- [SOLID, Clean Code e Design Patterns](docs/qualidade-tecnica.md)
- [TDD e BDD](docs/testes.md)
- [Deploy](docs/deploy.md)
