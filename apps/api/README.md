# SwissKit API

Backend NestJS para finanças pessoais no monorepo (`apps/api`).

## Arquitetura

- Camadas por módulo: `controller -> service -> repositories -> PrismaService`
- Tipagem de domínio central em `src/common/contracts/domain.contracts.ts`
- Enums compartilhados em `src/common/enums`
- Mapeadores de persistência para domínio em `src/common/mappers`
- Swagger habilitado em `/api/docs`
- Prisma 7 com `@prisma/adapter-pg`
- Auth Google + JWT em cookie HttpOnly (`src/modules/auth`)

## Módulos

- `health`
- `auth`
- `accounts`
- `categories`
- `subcategories`
- `transactions`

## Prisma (multi-file schema)

```txt
prisma/
  schema/
    schema.prisma
    enums.prisma
    allowed-email.prisma
    user.prisma
    account.prisma
    category.prisma
    subcategory.prisma
    transaction.prisma
  migrations/
  seed.ts
```

## Rodar localmente

```bash
npm install
npm run prisma:generate
npm run start:dev
```

## Configuração de ambiente

Use `apps/api/.env.example` como base para o seu `.env`.

Variáveis obrigatórias:

- `DATABASE_URL`
- `WEB_APP_URL`
- `CORS_ALLOWED_ORIGINS`
- `AUTH_COOKIE_NAME`
- `AUTH_COOKIE_SAME_SITE` (`lax`, `none` ou `strict`)
- `AUTH_COOKIE_SECURE` (`true` ou `false`)
- `AUTH_COOKIE_DOMAIN` (opcional, ex: `.example.com`)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Nota para deploy no Railway (`*.up.railway.app`):

- Use `AUTH_COOKIE_SAME_SITE=none` para permitir envio do cookie em chamadas cross-site entre frontend e API.
- Use `AUTH_COOKIE_SECURE=true` em produção (especialmente com `sameSite=none`).

Swagger:

- `http://localhost:3001/api/docs`

## Operação (produção)

Health checks:

- `GET /api/health/live`: liveness da aplicação (processo ativo)
- `GET /api/health/ready`: readiness (valida dependência crítica do banco via Prisma)
- `GET /api/health`: alias de compatibilidade para readiness

Comportamento esperado:

- `live` responde `200` com `status=ok` quando o processo está de pé
- `ready` responde `200` com `status=ready` quando o banco está acessível
- `ready` responde `503` com `status=not_ready` quando o banco está indisponível ou sem `DATABASE_URL`

Logging operacional:

- Logs HTTP incluem `requestId`, método, path (sem query string), status e latência
- Em produção, respostas de erro interno (`500`) são sanitizadas para não expor detalhes sensíveis
- O header `x-request-id` é retornado em todas as respostas para facilitar correlação de logs

Hardening HTTP:

- `helmet` habilitado no bootstrap da API
- `contentSecurityPolicy` e `crossOriginEmbedderPolicy` desativados para manter compatibilidade com Swagger em `/api/docs`

## Fluxo de autenticação

- Inicie em `GET /api/auth/google`
- O callback `GET /api/auth/google/callback` emite um JWT e salva em cookie HttpOnly
- O popup OAuth sinaliza sucesso/erro via `postMessage` restrito ao `WEB_APP_URL`
- `POST /api/auth/logout` limpa o cookie de autenticação
- `GET /api/auth/me` retorna o perfil autenticado
- Rotas protegidas aceitam cookie HttpOnly (com fallback opcional para `Authorization: Bearer`)

Restrição de acesso atual:

- Apenas e-mails ativos na tabela `AllowedEmail`
- Valor inicial incluído no seed: `pedroaugustogabironzani@gmail.com`

## Banco local com Docker

```bash
docker compose up -d
```
