# Swiss Kit Core

Monorepo base modular com frontend React, backend NestJS e contratos compartilhados. O domínio financeiro foi removido das superfícies ativas de frontend, backend e Prisma; o estado atual preserva o Core vazio com autenticação, health checks, shell web e tooling do workspace.

## Visão geral
- `apps/web`: shell web (Vite + React), rota protegida `/app` e camada de consumo da API.
- `apps/api`: API REST (NestJS + Prisma) com autenticação Google OAuth e sessão por cookie.
- `packages/contracts`: contratos compartilhados (tipos + schemas Zod), preservado para Core/auth.
- `docs/`: documentação técnica, operacional e ADRs.

Estado de transição:
- `/app` é a entrada protegida neutra do Core.
- `/financeiro/*` existe apenas como redirect legado temporário para `/app`.
- Bancos antigos com schema financeiro devem ser resetados ou reprovisionados para a baseline Core limpa.

## Stack
- Node.js 22+
- pnpm 10+
- Turbo (orquestração de tarefas no monorepo)
- Frontend: React, Vite, TypeScript, TanStack Query, Tailwind
- Backend: NestJS, Prisma 7, PostgreSQL, Passport (Google OAuth + JWT)

## Estrutura do repositório

```txt
apps/
  api/
  web/
packages/
  contracts/
  tsconfig/
docs/
  architecture.md
  env.md
  deployment.md
  adr/
    0001-monorepo-with-pnpm-and-turbo.md
    0002-cookie-auth-with-custom-domain.md
```

## Como rodar localmente

Pré-requisitos:
- Node.js 22+
- pnpm 10+
- Docker (opcional, para PostgreSQL local)

1. Instalar dependências:

```bash
pnpm install
```

2. Configurar variáveis de ambiente:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

3. (Opcional) Subir PostgreSQL local:

```bash
docker compose -f apps/api/docker-compose.yml up -d
```

4. Preparar Prisma (API):

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate:dev
pnpm --filter api prisma:seed
```

Use `prisma:migrate:dev` apenas em banco local/descartável. Ambientes existentes com histórico financeiro precisam de reset/reprovision antes de receber a baseline Core.

5. Rodar web + API:

```bash
pnpm dev
```

URLs locais padrão:
- Web: `http://localhost:8080`
- API: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`

## Scripts úteis (raiz)
- `pnpm dev`
- `pnpm dev:web`
- `pnpm dev:api`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Documentação
- Arquitetura: [`docs/architecture.md`](./docs/architecture.md)
- Variáveis de ambiente: [`docs/env.md`](./docs/env.md)
- Deploy: [`docs/deployment.md`](./docs/deployment.md)
- Fronteiras de frontend (web): [`apps/web/docs/frontend-boundaries.md`](./apps/web/docs/frontend-boundaries.md)
- ADRs: [`docs/adr/`](./docs/adr)
- Contribuição: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Segurança: [`SECURITY.md`](./SECURITY.md)

## Arquitetura e contribuição (resumo)
- O frontend consome a API com credenciais e valida respostas com contracts compartilhados.
- O backend aplica autenticação JWT por cookie HttpOnly e organiza domínio por módulos.
- O monorepo centraliza scripts e CI para manter evolução coordenada entre aplicações.

Para contribuir, siga o fluxo descrito em [`CONTRIBUTING.md`](./CONTRIBUTING.md) e valide localmente:

```bash
pnpm lint:ci
pnpm typecheck
pnpm test:ci
pnpm build:ci
```
