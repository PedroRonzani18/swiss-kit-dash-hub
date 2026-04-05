# SwissKit API

Backend NestJS para finanças pessoais no monorepo (`apps/api`).

## Arquitetura

- Camadas por módulo: `controller -> service -> repositories -> PrismaService`
- Tipagem de domínio central em `src/common/contracts/domain.contracts.ts`
- Enums compartilhados em `src/common/enums`
- Mapeadores de persistência para domínio em `src/common/mappers`
- Swagger habilitado em `/api/docs`
- Prisma 7 com `@prisma/adapter-pg`
- Auth Google + JWT em `src/modules/auth`

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
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Swagger:

- `http://localhost:3001/api/docs`

## Fluxo de autenticação

- Inicie em `GET /api/auth/google`
- O callback `GET /api/auth/google/callback` retorna `accessToken` JWT
- Use `Authorization: Bearer <token>` nas rotas protegidas
- `GET /api/auth/me` retorna o perfil autenticado

Restrição de acesso atual:

- Apenas e-mails ativos na tabela `AllowedEmail`
- Valor inicial incluído no seed: `pedroaugustogabironzani@gmail.com`

## Banco local com Docker

```bash
docker compose up -d
```
