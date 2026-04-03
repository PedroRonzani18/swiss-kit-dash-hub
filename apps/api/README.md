# SwissKit API (Backend Foundation)

Backend NestJS simplificado para o app de finanças pessoais.

## Princípios desta base

- Monorepo: backend em `apps/api`
- Arquitetura **single-tenant**
- Sem lógica legada de domínio
- Estrutura modular pronta para evolução

## Estrutura principal

```txt
src/
  main.ts
  app.module.ts
  config/
  common/
  modules/
    health/
    accounts/
    categories/
    subcategories/
    transactions/
    dashboard/
  prisma/
prisma/
  schema.prisma
  seed.ts
```

## Requisitos

- Node.js 20+
- PostgreSQL (opcional para subir API; necessário para persistência)

## Variáveis de ambiente

Exemplo mínimo (`.env`):

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/swisskit
```

## Rodando localmente

```bash
npm install
npm run prisma:generate
npm run start:dev
```

Swagger:

- `http://localhost:3001/api/docs`

## Prisma

```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
npm run prisma:studio
```

## Observações

- Esta fase é uma fundação estrutural.
- Módulos de finanças estão com implementação inicial simples para manter o backend compilável e organizado.
