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
