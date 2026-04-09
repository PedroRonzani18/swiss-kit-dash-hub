# Swiss Kit Dash Hub

Monorepo de análise financeira com:

- `apps/web`: frontend React + Vite + TanStack Query
- `apps/api`: backend NestJS + Prisma
- `packages/contracts`: contratos compartilhados (tipos + schemas)

## Estrutura

```txt
apps/
  api/
  web/
packages/
  contracts/
```

## Scripts úteis (raiz)

- `pnpm dev:web`
- `pnpm dev:api`
- `pnpm build:web`
- `pnpm build:api`
- `pnpm test:web`
- `pnpm test:api`
- `pnpm lint:web`
- `pnpm lint:api`

## Contribuição e CI

- Fluxo de contribuição: veja [`CONTRIBUTING.md`](./CONTRIBUTING.md).
- Política de segurança: veja [`SECURITY.md`](./SECURITY.md).
- Pull requests devem preencher o template em `.github/pull_request_template.md`.
- A CI do GitHub Actions (`.github/workflows/ci.yml`) roda em `push` e `pull_request` com:
  - `pnpm install --frozen-lockfile`
  - `pnpm lint:ci`
  - `pnpm typecheck`
  - `pnpm test:ci`
  - `pnpm build:ci`

## Padrões adotados

- Contratos de domínio compartilhados entre frontend e backend via `@swisskit/contracts`.
- Validação de respostas de API no frontend com schemas para detectar drift de contrato.
- Fluxos de transação baseados em IDs estáveis (`accountId`, `categoryId`, `subcategoryId`).
- Camada de mapeamento de domínio no frontend centralizada e coberta por testes.
- Exclusões em cascata (categoria/subcategoria -> transações relacionadas) garantidas no backend de forma transacional.

## Próximos passos recomendados

1. Fechar baseline de lint/prettier para CI totalmente verde.
2. Evoluir `useFinanceStore` para hooks por domínio (`accounts`, `categories`, `transactions`).
3. Aumentar cobertura com testes de integração da API (repositórios/serviços críticos).
