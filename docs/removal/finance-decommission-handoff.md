# Finance Decommission Handoff

## Objetivo

Descomissionar o dominio financeiro atual do `swiss-kit-dash-hub` e deixar o repositorio como um **Swiss Kit Core vazio/modular**, pronto para receber modulos futuros sem implementar o novo produto agora.

Plano detalhado de referencia:

- `docs/removal/finance-decommission-plan.md`

## Estado atual

- Apenas documentacao foi criada/atualizada.
- Nenhuma remocao de codigo foi executada.
- Nenhum arquivo de aplicacao foi alterado.
- Prisma, migrations, seed e banco ainda nao foram alterados.
- O modulo financeiro ainda existe no frontend, backend, contracts, Prisma, testes e docs.

## Decisoes ja tomadas

- O objetivo nao e criar produto novo; e extrair/preservar um Core vazio.
- `Swiss Kit Core` deve preservar auth, health, shell web, contracts core/auth, Prisma core, monorepo/tooling e validacoes essenciais.
- `Finance Module` deve ser removido em checkpoints sequenciais.
- A execucao futura pode ser em um unico PR, mas com commits/checkpoints pequenos e validacao incremental.
- Prisma deve seguir estrategia de **reset limpo**, nao migration incremental.
- O reset Prisma implica descarte explicito de dados financeiros e historico de migrations financeiro.
- Ambientes existentes, incluindo Railway/bancos atuais, devem ser tratados como reset/reprovision, nao upgrade.
- `@swisskit/contracts` deve sobreviver como pacote core/auth; remover apenas a superficie financeira.
- Dependency cleanup e opcional e deve ficar no final, com prova mecanica de nao uso.

## Proibido na proxima execucao

- Nao criar novo produto, dashboard, canvas, IA Dev OS, Jarvis ou modulo futuro.
- Nao remover dependencias npm antes do checkpoint final.
- Nao apagar configuracao essencial de monorepo, pnpm, Turbo, TypeScript, ESLint, Vite, NestJS ou workspace.
- Nao apagar arquivos `common` inteiros sem extrair/preservar partes de auth/core.
- Nao enfraquecer auth, guard global, cookies, CORS ou env validation para fazer testes passarem.
- Nao mexer em arquivos reais de ambiente.
- Nao tocar em segredos.
- Nao resetar Prisma antes de remover referencias TypeScript aos modelos financeiros.
- Nao remover endpoints financeiros antes de existir endpoint core protegido para substituir testes de auth/guard.

## Ordem recomendada de checkpoints

### 0. Pre-flight

- Confirmar comportamento de `/financeiro`: redirect para `/app`, 404 ou disabled.
- Confirmar copy exata da tela `/app`.
- Confirmar nome/shape do endpoint core protegido.
- Confirmar reset limpo Prisma e descarte de dados/historico financeiro.
- Confirmar que Core minimo deve sobreviver.

### 1. Web Core shell

- Criar rota protegida neutra `/app`.
- Fazer `/` redirecionar conforme autenticacao.
- Remover finance da navegacao visivel e command palette.
- Tratar `/financeiro` como legacy redirect/disabled.
- Ajustar copy minima para nao prometer dashboard financeiro.
- Nao deletar arquivos financeiros ainda.

Validacao:

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
pnpm test:web:e2e
```

### 2. Web tests/docs minimos

- Atualizar smoke/E2E para `/login`, `/app`, auth guard e rota desconhecida.
- Atualizar docs minimas de entrada para estado Core/transicao.
- Ainda nao deletar o modulo financeiro.

Validacao:

```bash
pnpm test:web
pnpm test:web:e2e
```

### 3. Contracts core/auth

- Separar `AuthProvider`, ids e tipos core/auth dos tipos financeiros.
- Atualizar imports de auth web/api para contracts core/auth.
- Preservar `@swisskit/contracts`.
- Nao remover `finance.ts` ate web/api nao dependerem dele.

Validacao:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

### 4. API core endpoint

- Criar endpoint core protegido minimo.
- Migrar testes de auth/guard que hoje usam endpoints financeiros para esse endpoint.
- Manter health operacional.

Validacao:

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

### 5. Frontend finance delete

- Deletar `apps/web/src/features/finance`.
- Deletar `apps/web/src/modules/finance`.
- Deletar `apps/web/src/types/finance.ts`.
- Remover testes web financeiros.
- Limpar imports, routes, navigation, command palette e lint rules especificas de finance.

Denylist web:

```bash
! rg -n "@/features/finance|@/modules/finance|@/types/finance|FinanceModulePage|FinanceModuleContent|FINANCE_MODULE_ROUTE|FINANCE_TASK_COMMANDS|financeQueryKeys|MODULE_ROUTES.finance" apps/web/src
```

Validacao:

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
pnpm test:web:e2e
```

### 6. Backend common extraction

- Preservar `AuthModule`, `HealthModule`, `PrismaModule`, auth decorators/guards, env validation e bootstrap.
- Em `common/contracts`, preservar user/auth e remover contratos financeiros.
- Em `common/enums`, preservar `AUTH_PROVIDER`.
- Em `common/mappers`, preservar mappers de user/auth.
- Nao deletar arquivos common inteiros se ainda contem Core.

Validacao:

```bash
pnpm lint:api
pnpm typecheck:api
```

### 7. Backend finance delete

- Desregistrar `AccountsModule`, `CategoriesModule`, `SubcategoriesModule`, `TransactionsModule`.
- Deletar controllers/services/repositories/DTOs financeiros.
- Remover/adaptar specs financeiras.
- Atualizar Swagger para nome/descricao neutros.

Denylist API:

```bash
! rg -n "AccountsModule|CategoriesModule|SubcategoriesModule|TransactionsModule|ACCOUNT_TYPE|TRANSACTION_TYPE|CreateAccountContract|TransactionContract|mapAccountFromPersistence|mapTransactionFromPersistence" apps/api/src
```

Validacao:

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

### 8. Prisma clean reset

- Remover relacoes financeiras de `User`.
- Remover modelos `Account`, `Category`, `Subcategory`, `Transaction`.
- Remover enums `AccountType`, `TransactionType`.
- Preservar `AuthProvider`, `User`, `AllowedEmail`.
- Remover migrations antigas financeiras.
- Criar baseline limpa Core.
- Atualizar `seed.ts` e test helpers para Core.
- Documentar reset/reprovision dos ambientes existentes.

Validacao minima:

```bash
pnpm --filter api prisma:generate
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

Validacao adicional desejada:

```bash
pnpm --filter api prisma:migrate:dev
```

Rodar apenas contra banco descartavel/local.

### 9. Docs finais

- Atualizar README, architecture, deployment, api README, frontend boundaries e docs AI para Core/transicao.
- Remover promessas de dashboard financeiro e CRUD financeiro.
- Nao documentar produto futuro.

Validacao:

```bash
rg -n "finance|Finance|financeiro|Financeiro|account|Account|category|Category|subcategory|Subcategory|transaction|Transaction" apps packages docs README.md
```

Ocorrencias restantes devem ser somente historicas/legadas intencionais ou nos documentos de remocao.

### 10. Dependency cleanup opcional

- So executar depois de toda remocao e denylist passarem.
- Remover apenas dependencias com prova mecanica de zero uso.
- Se `package.json` mudar, atualizar lockfile e validar tudo.

Validacao final:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

CI-parity quando possivel:

```bash
pnpm lint:ci
pnpm typecheck
pnpm test:ci
pnpm test:web:e2e
pnpm build:ci
```

## Perguntas abertas antes de tocar codigo

- Qual copy exata deve aparecer em `/app`?
- `/financeiro` deve redirecionar para `/app`, responder 404 ou mostrar pagina disabled?
- Qual nome e shape do endpoint core protegido?
- `packages/contracts/src/domain.ts` sera reduzido ou substituido por `auth.ts`/`core.ts`?
- Command palette deve sobreviver generica ou ser removida temporariamente?
- Quais docs `docs/ai/*` devem ser preservadas como historicas e quais devem ser reescritas?
- O banco local/Railway sera descartado sem backup?

## Maior risco

O checkpoint de maior chance de quebrar o repo e o **Prisma clean reset**, porque toca schema multi-file, migrations, generated client, seed, test helpers e banco.

Segundo maior risco: **backend common extraction**, porque arquivos common misturam finance com auth/core.

## Prompt recomendado para a proxima sessao

```text
Execute o descomissionamento do dominio financeiro seguindo docs/removal/finance-decommission-handoff.md.

Objetivo: deixar o repo como Swiss Kit Core vazio/modular.

Nao implemente produto novo. Nao crie IA Dev OS, Jarvis, canvas ou dashboard novo.
Execute em checkpoints sequenciais, validando entre eles.
Preserve auth, health, contracts core/auth, Prisma core e tooling do monorepo.
Use reset limpo de Prisma/migrations somente no checkpoint correspondente.
Nao remova dependencias npm antes do checkpoint final opcional.
Pare e reporte se algum checkpoint falhar ou se aparecer dependencia financeira fora do inventario.
```
