# Swiss Kit Dash Hub

Monorepo de análise financeira com:

- `apps/web`: frontend React + Vite + TanStack Query
- `apps/api`: backend NestJS + Prisma

## Estrutura atual

```txt
apps/
  api/
  web/
```

## Scripts na raiz

- `pnpm dev` — executa workspace web via script da raiz
- `pnpm build` — build do workspace web
- `pnpm test` — testes do workspace web
- `pnpm lint` — lint do workspace web

## Diretrizes de arquitetura (curto prazo)

- Fluxos de transação no frontend devem usar IDs estáveis (`accountId`, `categoryId`, `subcategoryId`) para persistência.
- Regras de integridade de dados (como exclusões em cascata) ficam no backend.
- Camada de transformação de dados deve ser centralizada em utilitários de feature (`features/finance/mappers.ts`) para facilitar testes.

## Próximos passos recomendados

1. Criar pacote `packages/contracts` para compartilhar contratos de API entre front e back.
2. Evoluir cobertura de testes para hooks e fluxos de integração.
3. Modularizar ainda mais o domínio financeiro por feature para reduzir acoplamento.
