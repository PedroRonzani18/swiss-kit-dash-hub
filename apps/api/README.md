# SwissKit API

Backend NestJS para finanças pessoais no monorepo (`apps/api`).

## Arquitetura

- Camadas por módulo: `controller -> service -> repositories -> PrismaService`
- Tipagem de domínio em `src/common/contracts`
- Swagger habilitado em `/api/docs`
- Prisma 7 com `@prisma/adapter-pg`

## Módulos

- `health`
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

Swagger:

- `http://localhost:3001/api/docs`

## Banco local com Docker

```bash
docker compose up -d
```
