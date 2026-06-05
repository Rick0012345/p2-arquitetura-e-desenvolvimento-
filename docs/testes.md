# TDD e BDD

## TDD

Os testes unitários do pedido foram escritos para guiar as regras principais:

- pedido válido é criado com total correto;
- pedido sem itens é rejeitado;
- método de pagamento desconhecido é rejeitado.

Arquivo principal: `services/order-service/test/create-order.test.js`.

## BDD

O comportamento esperado do negócio está descrito em Gherkin:

`tests/bdd/features/order-flow.feature`

O cenário também possui um teste automatizado equivalente em:

`tests/bdd/order-flow.test.js`
