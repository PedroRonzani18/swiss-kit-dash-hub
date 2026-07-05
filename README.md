# Swiss Kit Core

Monorepo base modular com frontend React, backend NestJS e contratos compartilhados. O repositório funciona como um template Core com autenticação, access-control local, health checks, shell web e tooling do workspace prontos para receber módulos futuros.

## Visão geral
- `apps/web`: shell web (Vite + React), rotas protegidas, module registry e camada de consumo da API.
- `apps/api`: API REST (NestJS + Prisma) com autenticação Google OAuth, sessão por cookie e guards de permissão.
- `packages/contracts`: contratos compartilhados (tipos + schemas Zod) entre API e web.
- `docs/`: documentação técnica, operacional e ADRs.
- `scripts/`: automações leves do template, como scaffold de módulo.

Estado atual:
- `/app` é a entrada protegida neutra do Core.
- `/tasks` é um módulo exemplo estático para servir de referência.
- A baseline Prisma contém entidades Core de autenticação, allowlist e access-control local.

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
  template-usage.md
  adr/
    0001-monorepo-with-pnpm-and-turbo.md
    0002-cookie-auth-with-custom-domain.md
scripts/
  scaffold-module.mjs
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

Use `prisma:migrate:dev` apenas em banco local/descartável.

5. Rodar web + API:

```bash
pnpm dev
```

URLs locais padrão:
- Web: `http://localhost:8080`
- API: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`

## Criar módulo novo

Use o scaffold:

```bash
pnpm scaffold:module tasks
```

Depois registre o módulo em:

```txt
apps/web/src/app/navigation/modules.ts
```

Para módulos protegidos, adicione permissões em:

```txt
packages/contracts/src/access-control-catalog.ts
```

Veja o fluxo completo em [`docs/template-usage.md`](./docs/template-usage.md).

## Scripts úteis (raiz)
- `pnpm dev`
- `pnpm dev:web`
- `pnpm dev:api`
- `pnpm scaffold:module <module-id>`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Documentação
- Uso do template: [`docs/template-usage.md`](./docs/template-usage.md)
- Arquitetura: [`docs/architecture.md`](./docs/architecture.md)
- Contracts: [`docs/contracts.md`](./docs/contracts.md)
- Access-control: [`docs/access-control.md`](./docs/access-control.md)
- Variáveis de ambiente: [`docs/env.md`](./docs/env.md)
- Deploy: [`docs/deployment.md`](./docs/deployment.md)
- Fronteiras de frontend (web): [`apps/web/docs/frontend-boundaries.md`](./apps/web/docs/frontend-boundaries.md)
- HTTP client web: [`apps/web/docs/http-client.md`](./apps/web/docs/http-client.md)
- ADRs: [`docs/adr/`](./docs/adr)
- Contribuição: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Segurança: [`SECURITY.md`](./SECURITY.md)

## Arquitetura e contribuição (resumo)
- O frontend consome a API com credenciais e valida respostas com contracts compartilhados.
- O backend aplica autenticação JWT por cookie HttpOnly e autorização por permissões locais.
- O monorepo centraliza scripts e CI para manter evolução coordenada entre aplicações.
- O módulo `tasks` é exemplo de referência para novos módulos, não funcionalidade de produto.

Para contribuir, siga o fluxo descrito em [`CONTRIBUTING.md`](./CONTRIBUTING.md) e valide localmente:

```bash
pnpm lint:ci
pnpm typecheck
pnpm test:ci
pnpm build:ci
```
