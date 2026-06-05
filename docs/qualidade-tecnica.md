# Clean Code, SOLID e Design Patterns

## Clean Code

- Métodos pequenos e com nomes objetivos, como `calculateTotal`, `markAsPaid` e `createOrder`.
- Validações próximas do domínio, evitando controllers com regra de negócio.
- Erros explícitos para entradas inválidas.
- Estrutura de pastas previsível e igual entre os microsserviços.

## SOLID

- S: `CreateOrderUseCase` só cria pedidos.
- O: novas formas de pagamento entram por novas estratégias, sem alterar o caso de uso.
- L: qualquer estratégia com método `authorize` substitui as estratégias existentes.
- I: repositórios expõem apenas os métodos usados pelo caso de uso.
- D: casos de uso dependem de abstrações recebidas no construtor.

## Design Patterns

| Pattern | Onde aparece | Motivo |
| --- | --- | --- |
| Repository | `InMemoryOrderRepository`, `InMemoryProductRepository` | Isola persistência da regra de negócio |
| Factory | `OrderFactory` | Centraliza criação de pedidos válidos |
| Strategy | `PixPaymentStrategy`, `CreditCardPaymentStrategy` | Permite trocar regra de pagamento |
| Observer | `OrderCreatedNotifier` | Reage à criação de pedido sem acoplar o caso de uso |
| Facade | `CatalogFacade` | Simplifica acesso à listagem do catálogo |
