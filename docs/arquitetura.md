# Arquitetura

## Arquitetura Limpa

Cada microsserviço segue a mesma organização:

- `domain`: entidades e regras puras de negócio.
- `application`: casos de uso que orquestram as regras.
- `infrastructure`: implementação concreta de armazenamento ou integrações.
- `presentation`: servidor HTTP e adaptação de entrada e saída.

As dependências apontam de fora para dentro. O domínio não conhece HTTP, Docker, banco de dados ou frameworks.

## Microsserviços

### Catalog Service

Responsável por listar produtos disponíveis para venda. Foi isolado porque catálogo muda com frequência e pode crescer para estoque real.

### Order Service

Responsável por criar pedidos, validar itens e aplicar a estratégia de pagamento escolhida.

### Notification Service

Responsável por registrar notificações. Em produção, poderia publicar mensagens para WhatsApp, e-mail ou fila.

## Comunicacao entre servicos

Na prova, a comunicacao e demonstrada pelo fluxo completo do frontend:

1. O frontend consulta `catalog-service` para carregar produtos em `GET /products`.
2. O frontend envia o pedido para `order-service` em `POST /orders`.
3. Apos o pedido ser criado, o frontend registra a mensagem operacional em `notification-service` usando `POST /notifications`.

Cada servico tambem possui `GET /health` para verificacao local, Docker e Render.

## Decisões técnicas

Node.js foi escolhido por permitir uma API simples, com baixo custo de hospedagem. A implementação usa módulos nativos para reduzir dependências e facilitar a avaliação do código. Docker Compose foi usado para executar os serviços juntos com comandos reproduzíveis.
