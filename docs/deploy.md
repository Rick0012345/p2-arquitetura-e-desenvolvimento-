# Deploy

## Plataforma sugerida

Render, por aceitar deploy direto do GitHub e configuração via `render.yaml`.

## Passos

1. Enviar este repositório para o GitHub.
2. Acessar Render e escolher `New > Blueprint`.
3. Conectar o repositório.
4. Confirmar a criação dos três serviços.
5. Abrir os links `/health` gerados pelo Render.
6. Atualizar o `README.md` com os links publicados.

## Observação

O arquivo `render.yaml` já contém a configuração dos três serviços. O avaliador consegue executar localmente com Docker mesmo antes do deploy.

## Servicos publicados

O deploy deve gerar tres URLs independentes:

| Servico | Origem | Health check |
| --- | --- | --- |
| `feiraconecta-catalog-service` | `services/catalog-service/Dockerfile` | `/health` |
| `feiraconecta-order-service` | `services/order-service/Dockerfile` | `/health` |
| `feiraconecta-notification-service` | `services/notification-service/Dockerfile` | `/health` |

Depois do deploy, copie as URLs geradas para a secao "Link publicado" do `README.md`.
