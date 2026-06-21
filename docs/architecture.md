# Arquitetura

## Visão geral do sistema
O `swiss-kit-dash-hub` está em transição para um Swiss Kit Core vazio/modular. O Core preserva autenticação, health checks, shell web, contratos compartilhados e tooling do monorepo sem expor um produto financeiro como entrada principal.

O domínio financeiro foi removido das superfícies ativas de frontend, backend e Prisma. As menções restantes devem ser históricas, de descomissionamento ou de compatibilidade temporária.

Componentes principais:
- `apps/web`: frontend React que renderiza o shell Core, protege `/app`, consome a API e valida contratos de resposta.
- `apps/api`: backend NestJS que expõe endpoints REST, autentica usuários via Google OAuth e persiste dados no PostgreSQL.
- `packages/contracts`: pacote compartilhado com tipos e schemas Zod, preservado para contratos Core/auth.

Fluxo macro:
1. O usuário interage com o frontend (`apps/web`).
2. O frontend chama a API com `fetch` e `credentials: include`.
3. A API valida autenticação, executa regras de domínio e acessa o banco via Prisma.
4. O frontend valida payloads com Zod e atualiza o estado/caches com React Query.

## Monorepo com pnpm + Turbo
O repositório usa:
- `pnpm` para workspaces (`apps/*` e `packages/*`).
- `turbo` para orquestrar `build`, `lint`, `test`, `typecheck` e `dev`.

Benefícios práticos no estado atual:
- scripts centralizados na raiz para web e API;
- execução por filtro (`--filter=web`, `--filter=api`);
- pipeline de CI consistente para todos os pacotes.

## Frontend (`apps/web`)
Tecnologias centrais:
- React + Vite + TypeScript
- TanStack Query para cache/sincronização de dados
- React Router para roteamento

Responsabilidades principais:
- autenticação e sessão no browser via `AuthProvider`;
- rota protegida neutra em `/app`;
- redirect legado protegido de `/financeiro/*` para `/app`;
- validação de payloads da API com schemas de `@swisskit/contracts`, quando aplicável.

Notas de integração:
- base da API é `VITE_API_URL` (com fallback para `/api`);
- em desenvolvimento, o Vite proxya `/api` para `http://localhost:3001`.

## Backend (`apps/api`)
Tecnologias centrais:
- NestJS + TypeScript
- Prisma 7 com adapter PostgreSQL (`@prisma/adapter-pg`)
- Passport (Google OAuth2 + JWT)

Organização principal:
- módulos Core preservados: `auth` e `health`;
- módulo `core` para endpoints protegidos neutros, como `GET /api/core/session-check`;
- padrão por módulo: `controller -> service -> repository`;
- `PrismaService` compartilhado para acesso a dados;
- `JwtAuthGuard` global, com rotas públicas explícitas via `@Public()`.

Capacidades operacionais:
- Swagger em `/api/docs`;
- health checks em `/api/health/live`, `/api/health/ready` e `/api/health`;
- CORS com allowlist por variável de ambiente.

## Contratos compartilhados (`packages/contracts`)
O pacote contém:
- superfície Core/auth em `core.ts`;
- exports compartilhados necessários para autenticação e ids.

Uso atual:
- auth e consumidores web/API preservam o pacote compartilhado;
- a API mantém também contratos internos em `apps/api/src/common/contracts`.

Observação de transição: arquivos legados de contratos financeiros, se presentes no pacote, não representam produto ativo e não devem ser usados por web/API Core.

## Fluxo de autenticação (alto nível)
1. O frontend inicia login em `GET /api/auth/google`.
2. A API redireciona para Google OAuth.
3. No callback (`GET /api/auth/google/callback`), a API valida o perfil e confere allowlist (`AllowedEmail`).
4. A API faz upsert do usuário, assina JWT e grava cookie HttpOnly.
5. A página de callback comunica sucesso/erro para o frontend via `postMessage` restrito ao `WEB_APP_URL`.
6. O frontend invalida cache de sessão e consulta `GET /api/auth/me`.
7. Rotas protegidas aceitam JWT por cookie (e fallback opcional por Bearer token).

## Fluxo de dados (alto nível)
1. Componentes do shell/autenticação acionam hooks/queries.
2. A camada `src/api/*` chama endpoints REST quando necessário.
3. O backend autentica o usuário e delega para services/repositories.
4. Repositories executam operações Prisma no PostgreSQL.
5. Respostas retornam ao frontend.
6. O frontend valida schema, normaliza mapeamentos e atualiza cache React Query.

## Decisões estruturais principais
- Monorepo único para web/API/contratos com toolchain compartilhado.
- Contratos compartilhados para reduzir drift entre backend e frontend.
- Sessão baseada em cookie HttpOnly (em vez de token em storage do browser).
- Guard global de autenticação, com rotas públicas explícitas.
- Reset Prisma limpo para baseline Core; bancos antigos com dados financeiros exigem reset/reprovision, não migration incremental.
- `/financeiro/*` mantido temporariamente apenas como redirect legado protegido para `/app`.
