# Finance Decommission Plan

## Resumo do objetivo

Planejar o descomissionamento controlado do domínio financeiro atual sem executar a remoção nesta rodada.

O objetivo revisado é transformar o repo em um **Swiss Kit Core vazio e modular**, preservando a infraestrutura útil para módulos futuros e removendo o módulo financeiro atual como domínio de produto. Esta auditoria nao implementa o novo produto e nao executa remocao.

## Decisao de direcao

- Preservar um Core minimo do Swiss Kit.
- Remover o Finance Module atual em checkpoints sequenciais.
- Executar a remocao futura preferencialmente em um unico PR, com commits/checkpoints pequenos e validacao incremental.
- Usar reset limpo de Prisma/migrations para uma nova baseline Core, com descarte explicito de dados e historico financeiro.
- Nao criar novo produto, IA Dev OS, Jarvis, canvas ou dashboard novo durante o descomissionamento.

## Swiss Kit Core a preservar

O Core e a parte do repo que deve sobreviver ao descomissionamento financeiro:

- Monorepo `pnpm` + Turbo.
- Tooling essencial: TypeScript, ESLint, Vite, NestJS, Prisma, configs workspace e scripts basicos.
- `apps/web` com React/Vite, router, auth gate, layout basico, rota protegida neutra e experiencia de login/logout.
- `apps/api` com NestJS, bootstrap, env validation, CORS/cookies/helmet, auth, health checks, PrismaModule e Swagger neutro.
- Auth Google, sessao por cookie, allowlist e entidades core de usuario.
- Prisma core com `User`, `AllowedEmail`, `AuthProvider` e schema baseline limpo.
- `packages/contracts` preservado como pacote de contratos core/auth, nao como pacote financeiro.
- UI compartilhada e infraestrutura de API client/validation enquanto nao houver prova mecanica de inutilidade.
- Testes minimos de auth, health, shell web e rota protegida neutra.

## Finance Module a remover

O modulo financeiro removivel inclui:

- Frontend financeiro em `apps/web/src/features/finance`, `apps/web/src/modules/finance` e `apps/web/src/types/finance.ts`.
- Rotas, navegacao, command palette e textos que apontam para `/financeiro` como modulo default.
- Backend financeiro em `accounts`, `categories`, `subcategories` e `transactions`.
- Contracts financeiros em `packages/contracts/src/finance.ts` e tipos financeiros em `packages/contracts/src/domain.ts`.
- Modelos Prisma financeiros: `Account`, `Category`, `Subcategory`, `Transaction`, `AccountType`, `TransactionType`.
- Tests e docs que descrevem ou validam CRUD financeiro como produto atual.

## Core minimo permitido vs reconstrucao proibida

Permitido durante o descomissionamento:

- Rota protegida neutra, preferencialmente `/app`.
- Mensagem neutra do tipo "nenhum modulo ativo" ou "Swiss Kit pronto para novos modulos".
- Header/layout/sidebar existentes se forem genericos.
- Endpoint core protegido minimo para validar auth/guard.
- Contracts core/auth e schema Prisma core.
- Docs de transicao/core.

Proibido durante o descomissionamento:

- Novo dashboard de produto.
- IA Dev OS, Jarvis, canvas ou qualquer modulo futuro.
- Coletores ou integracoes novas.
- Modelos Prisma de produto futuro.
- Contratos alem de auth/core/bootstrap minimo.
- UI aspiracional que funcione como especificacao do produto novo.

## Inventario encontrado

### Frontend financeiro

Evidencia observada: existem 58 arquivos sob o modulo financeiro web.

- `apps/web/src/features/finance/`
- `apps/web/src/modules/finance/pages/FinanceModulePage.tsx`
- `apps/web/src/types/finance.ts`

Principais subareas:

- API client da feature: `apps/web/src/features/finance/api/accountsApi.ts`, `categoriesApi.ts`, `subcategoriesApi.ts`, `transactionsApi.ts`, `queryKeys.ts`, `invalidation.ts`.
- Roteamento/navegacao: `apps/web/src/features/finance/routeContract.ts`, `navigation.ts`, `commands.ts`.
- Composicao de modulo: `apps/web/src/features/finance/FinanceModuleContent.tsx`, `apps/web/src/modules/finance/pages/FinanceModulePage.tsx`.
- Dashboard e fluxo de transacoes: `apps/web/src/features/finance/components/dashboard/*`.
- Gestao de contas/categorias/transacoes: `apps/web/src/features/finance/components/management/*`.
- Analytics financeiro: `apps/web/src/features/finance/components/management/analytics/*`, `apps/web/src/features/finance/model/analytics.ts`.
- Hooks e estado: `apps/web/src/features/finance/hooks/*`.
- Mappers/modelos auxiliares: `apps/web/src/features/finance/mappers.ts`, `model/dashboardStatus.ts`, `model/prefetch.ts`.

Acoplamentos fora da pasta financeira:

- `apps/web/src/app/routes/AppRoutes.tsx` importa `FinanceModulePage` e registra as rotas protegidas de `MODULE_ROUTES.finance`.
- `apps/web/src/app/navigation/modules.ts` define `MODULE_ROUTES.finance`, `APP_MODULES` com label `Financeiro` e `DEFAULT_MODULE_ROUTE = MODULE_ROUTES.finance`.
- `apps/web/src/components/CommandPalette.tsx` importa `FINANCE_TASK_COMMANDS`.
- `apps/web/src/components/AppHeader.tsx` tem breadcrumb default `["App", "Financeiro"]`.
- `apps/web/src/pages/Index.tsx` reexporta `FinanceModulePage`.
- `apps/web/src/modules/auth/pages/LoginPage.tsx` diz "dashboard financeiro".
- `apps/web/eslint.config.js` contem regras especificas para `src/features/finance`, `@/features/finance` e uma camada `services` financeira ja descontinuada.
- `apps/web/docs/frontend-boundaries.md` documenta o contrato de navegacao financeira.

### Backend financeiro

Evidencia observada: existem 25 arquivos nos modulos Nest financeiros.

- `apps/api/src/modules/accounts/*`
- `apps/api/src/modules/categories/*`
- `apps/api/src/modules/subcategories/*`
- `apps/api/src/modules/transactions/*`

Endpoints/controladores observados:

- `apps/api/src/modules/accounts/accounts.controller.ts`: `GET /accounts`, `GET /accounts/:id`, `POST /accounts`, `PATCH /accounts/:id`, `DELETE /accounts/:id`.
- `apps/api/src/modules/categories/categories.controller.ts`: CRUD de categorias.
- `apps/api/src/modules/subcategories/subcategories.controller.ts`: CRUD de subcategorias.
- `apps/api/src/modules/transactions/transactions.controller.ts`: CRUD de transacoes e `POST /transactions/bulk`.

Acoplamentos backend fora dos modulos:

- `apps/api/src/app.module.ts` importa e registra `AccountsModule`, `CategoriesModule`, `SubcategoriesModule` e `TransactionsModule`.
- `apps/api/src/common/contracts/domain.contracts.ts` reexporta contratos financeiros compartilhados e define contratos internos de create/update.
- `apps/api/src/common/enums/domain.enums.ts` define `ACCOUNT_TYPE` e `TRANSACTION_TYPE`.
- `apps/api/src/common/mappers/domain.mapper.ts` contem mappers de `Account`, `Category`, `Subcategory` e `Transaction` alem dos mappers de usuario/autenticacao.
- `apps/api/src/main.ts` configura Swagger com titulo `SwissKit Finance API` e descricao de app de financas pessoais.

### Shared contracts

Evidencia observada:

- `packages/contracts/src/finance.ts` define schemas Zod e tipos para `account`, `category`, `subcategory`, `transaction`, inputs de criacao/update e bulk transactions.
- `packages/contracts/src/domain.ts` define `TransactionType`, `AccountType`, `AuthProvider`, `EntityId` e `IsoDateString`.
- `packages/contracts/src/index.ts` exporta `./domain` e `./finance`.

Dependencia importante:

- `AuthProvider` ainda e usado por auth em `apps/web/src/types/auth.ts` e `apps/api/src/common/contracts/domain.contracts.ts`.
- Portanto, nao remover `packages/contracts` inteiro. Preservar como contracts core/auth e remover apenas a superficie financeira.

### Prisma e banco

Evidencia observada:

- Schemas financeiros:
  - `apps/api/prisma/schema/account.prisma`
  - `apps/api/prisma/schema/category.prisma`
  - `apps/api/prisma/schema/subcategory.prisma`
  - `apps/api/prisma/schema/transaction.prisma`
  - `apps/api/prisma/schema/enums.prisma` contem `AccountType` e `TransactionType`, mas tambem `AuthProvider`.
- Schema auth/operacional que deve ser preservado:
  - `apps/api/prisma/schema/user.prisma`
  - `apps/api/prisma/schema/allowed-email.prisma`
  - `apps/api/prisma/schema/schema.prisma`
- `apps/api/prisma/schema/user.prisma` possui relacoes para `accounts`, `categories`, `subcategories` e `transactions`.
- `apps/api/prisma/seed.ts` cria `AllowedEmail` e `User`, mas tambem cria `account` e `category` demo.
- Migrações atuais:
  - `apps/api/prisma/migrations/20260404023228_iniitial_migration/migration.sql` cria enums financeiros, tabelas financeiras e tambem `User`.
  - `apps/api/prisma/migrations/20260405103000_add_allowed_email_allowlist/migration.sql` cria `AllowedEmail`.
  - `apps/api/prisma/migrations/20260504203000_add_transaction_installments/migration.sql` altera `Transaction`.

Decisao revisada:

- Fazer reset limpo de Prisma/migrations para uma baseline Core.
- Assumir descarte de dados financeiros e da continuidade do banco atual.
- Tratar Railway/bancos existentes como reprovision/reset, nao upgrade incremental.

### Testes obsoletos ou impactados

Testes financeiros diretos:

- `apps/api/test/accounts.integration.spec.ts`
- `apps/api/test/categories-subcategories.integration.spec.ts`
- `apps/api/test/transactions.integration.spec.ts`
- `apps/web/src/features/finance/components/FinanceDataPrefetcher.test.tsx`
- `apps/web/src/features/finance/hooks/useTransactionTableFilters.test.ts`
- `apps/web/src/features/finance/mappers.test.ts`
- `apps/web/src/features/finance/model/analytics.test.ts`
- `apps/web/src/features/finance/model/dashboardStatus.test.ts`
- `apps/web/src/features/finance/model/prefetch.test.ts`
- `apps/web/e2e/smoke.spec.ts` usa describe `Smoke | Finance`.

Testes nao financeiros mas impactados:

- `apps/api/test/auth.integration.spec.ts` valida bloqueio de rotas protegidas usando `/api/accounts`, `/api/categories`, `/api/subcategories` e `/api/transactions`.
- `apps/api/test/helpers/database.helper.ts` limpa tabelas financeiras antes de `user` e `allowedEmail`.
- `apps/api/test/helpers/auth.helper.ts` depende de `User`, que deve continuar existindo.

### Documentacao financeira

Docs que descrevem o produto como dashboard financeiro:

- `README.md`
- `docs/architecture.md`
- `docs/deployment.md`
- `docs/ai/architecture.md`
- `docs/ai/domain-map.md`
- `docs/ai/security.md`
- `apps/api/README.md`
- `apps/web/docs/frontend-boundaries.md`

Docs de comandos/validacao relacionadas:

- `docs/ai/testing.md`
- `docs/ai/commands.md`
- `docs/env.md`

### Scripts

Scripts versionados observados:

- Raiz `package.json`: scripts de monorepo para `dev`, `lint`, `typecheck`, `test`, `build` e filtros web/api.
- `apps/api/package.json`: scripts Nest/Prisma/test, incluindo `prisma:generate`, `prisma:migrate:*`, `prisma:seed`.
- `apps/web/package.json`: scripts Vite/Vitest/Playwright e `ui-deps:audit`.
- `apps/web/scripts/audit-ui-deps.mjs`: script de auditoria de dependencias UI.

Nao foi encontrada evidencia de scripts de collectors, importadores bancarios, Plaid, Open Finance, OFX, CSV import, YNAB, Nordigen, Belvo ou Pluggy.

### Dependencias npm candidatas a revisao

Evidencia atual por import:

- `@swisskit/contracts` e usado por auth e finance; preservar como core/auth.
- `date-fns` aparece em componentes financeiros; candidato apenas apos remocao fisica e auditoria.
- `react-day-picker` e usado por `apps/web/src/components/ui/calendar.tsx`, que hoje e usado pelo fluxo financeiro; candidato apenas se calendar ficar comprovadamente orfao.
- `@radix-ui/react-checkbox`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-select`, `@radix-ui/react-tabs` sao usados por UI compartilhada/finance; reavaliar depois.
- `cmdk` e usado por `CommandPalette`; preservar por default se a shell futura pode usar command palette.
- `@tanstack/react-query` e usado por auth e finance; preservar se auth/session continuar usando React Query.
- `lucide-react`, `sonner`, `class-variance-authority`, `clsx`, `tailwind-merge`, `next-themes` tem usos fora do dominio financeiro e nao sao candidatos imediatos.
- `zod` e usado em contracts e `apps/web/src/api/validation.ts`; preservar enquanto contracts/validacao existirem.

Regra revisada:

- Dependency cleanup e checkpoint final opcional.
- Nao remover dependencias por suspeita.
- Remover somente com prova mecanica de zero imports/uso em configs/scripts e validacao completa depois do lockfile.

## Dependencias entre camadas

Fluxo financeiro atual observado:

1. `packages/contracts/src/finance.ts` define schemas/tipos.
2. API importa tipos compartilhados por `apps/api/src/common/contracts/domain.contracts.ts`.
3. Módulos Nest de `accounts`, `categories`, `subcategories` e `transactions` implementam controllers/services/repositories.
4. Repositories usam modelos Prisma financeiros.
5. Web importa schemas de `@swisskit/contracts` em `apps/web/src/features/finance/api/*`.
6. Hooks e componentes financeiros consomem APIs e mappers.
7. Rotas protegidas apontam `/financeiro` para `FinanceModulePage`.
8. Command palette, sidebar/navigation e headers assumem o modulo financeiro como default.

Dependencias criticas:

- Nao remover `packages/contracts/src/finance.ts` antes de atualizar web/api para contracts core/auth.
- Nao resetar Prisma antes de remover repositories financeiros e referencias a `prisma.account`, `prisma.category`, `prisma.subcategory` e `prisma.transaction`.
- Nao apagar arquivos `common` inteiros se eles contem mappers/enums/contracts de auth.
- Nao remover endpoints financeiros antes de criar endpoint core protegido para substituir testes de auth/guard.

## Plano de execucao revisado: PR unico com checkpoints

O plano futuro deve ser executado em um unico PR, mas com checkpoints/commits sequenciais e validacao entre eles. Nenhum checkpoint deve deixar a branch em estado final quebrado.

### Checkpoint 0 - Pre-flight e gates

- Confirmar que o objetivo e Core vazio/modular, nao novo produto.
- Confirmar reset limpo de Prisma/migrations e descarte de dados financeiros.
- Confirmar que ambientes Railway/bancos existentes serao reprovisionados/resetados.
- Confirmar que auth, health, toolchain, contracts core e shell web devem sobreviver.
- Rodar baseline opcional antes de mexer, se o ambiente permitir.

Gate bloqueante:

- Sem confirmacao de reset clean, nao tocar em Prisma/migrations.
- Sem definicao de Core minimo, nao deletar arquivos compartilhados.

### Checkpoint 1 - Core web neutro e quarentena de entrada

- Criar rota protegida neutra `/app`.
- Fazer `/` redirecionar para `/app` quando autenticado e para `/login` quando nao autenticado.
- Remover `Financeiro` da navegacao visivel e command palette.
- Tratar `/financeiro` inicialmente como legacy redirect para `/app` ou rota disabled explicita.
- Atualizar copy minima de login/header para nao prometer dashboard financeiro.
- Atualizar smoke/E2E para `/login`, `/app`, auth guard e rota desconhecida.
- Atualizar docs minimas de entrada para estado Core/transicao.
- Nao deletar ainda `apps/web/src/features/finance` nem `apps/web/src/modules/finance`.

Validacao:

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
pnpm test:web:e2e
```

Aceite:

- Usuario nao autenticado em `/` vai para `/login`.
- Usuario autenticado em `/` vai para `/app`.
- Logout volta para `/login`.
- Navegacao e command palette nao oferecem tarefas financeiras.
- `/financeiro` tem comportamento legacy/disabled intencional.

### Checkpoint 2 - Contracts core/auth e endpoint core protegido

- Preservar `@swisskit/contracts`.
- Separar `AuthProvider`, ids e tipos compartilhados core/auth de tipos financeiros.
- Atualizar imports de auth web/api para contracts core/auth.
- Criar endpoint core protegido minimo para substituir testes de auth que hoje usam endpoints financeiros.
- Manter `GET /api/health/*` como operacional e provavelmente publico.
- Atualizar testes de auth/guard para endpoint core protegido.

Validacao:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Aceite:

- Auth nao depende de `finance.ts`.
- Existe endpoint core protegido que retorna 401 sem auth.
- `GET /api/auth/me` segue funcionando autenticado.

### Checkpoint 3 - Remocao fisica do frontend financeiro

- Deletar `apps/web/src/features/finance`.
- Deletar `apps/web/src/modules/finance`.
- Deletar `apps/web/src/types/finance.ts`.
- Remover testes web financeiros.
- Remover regras ESLint/documentacao web especificas de finance ou trocar por regras genericas de modulos.
- Manter componentes compartilhados e dependencias npm.

Validacao:

```bash
rg -n "@/features/finance|@/modules/finance|@/types/finance|FinanceModulePage|FinanceModuleContent|FINANCE_MODULE_ROUTE|FINANCE_TASK_COMMANDS|financeQueryKeys|MODULE_ROUTES.finance" apps/web/src
pnpm lint:web
pnpm typecheck:web
pnpm test:web
```

Aceite:

- O `rg` acima deve retornar zero ocorrencias, exceto referencias legacy explicitamente documentadas se ainda existirem.
- Web compila/testa sem carregar finance.

### Checkpoint 4 - Remocao backend financeira com extracao seletiva de Core

- Preservar `AuthModule`, `HealthModule`, `PrismaModule`, `JwtAuthGuard`, decorators de auth, env validation e bootstrap.
- Em `apps/api/src/common/contracts/domain.contracts.ts`, preservar contratos de user/auth e remover contratos financeiros.
- Em `apps/api/src/common/enums/domain.enums.ts`, preservar `AUTH_PROVIDER` e remover `ACCOUNT_TYPE`/`TRANSACTION_TYPE`.
- Em `apps/api/src/common/mappers/domain.mapper.ts`, preservar `mapUserFromPersistence` e `mapAuthenticatedUser`; remover mappers financeiros.
- Desregistrar `AccountsModule`, `CategoriesModule`, `SubcategoriesModule` e `TransactionsModule` de `AppModule`.
- Deletar controllers/services/repositories/DTOs financeiros.
- Atualizar Swagger para nome/descricao neutros.
- Remover/adaptar specs financeiras da API.

Validacao:

```bash
rg -n "AccountsModule|CategoriesModule|SubcategoriesModule|TransactionsModule|ACCOUNT_TYPE|TRANSACTION_TYPE|CreateAccountContract|TransactionContract|mapAccountFromPersistence|mapTransactionFromPersistence" apps/api/src
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

Aceite:

- O `rg` acima deve retornar zero ocorrencias fora de docs/plano.
- Auth e health seguem testados.
- Testes de guard global nao dependem de endpoints financeiros.

### Checkpoint 5 - Reset Prisma clean para baseline Core

- Remover relacoes financeiras de `User`.
- Remover modelos `Account`, `Category`, `Subcategory`, `Transaction`.
- Remover enums `AccountType` e `TransactionType`.
- Preservar `AuthProvider`.
- Remover migrations antigas financeiras e criar baseline limpa Core.
- Atualizar `seed.ts` para semear apenas allowlist e, se necessario, usuario demo core/auth.
- Atualizar `apps/api/test/helpers/database.helper.ts` para limpar apenas tabelas Core.
- Documentar que ambientes existentes precisam reset/reprovision, nao migration incremental.

Validacao:

```bash
pnpm --filter api prisma:generate
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

Aceite:

- Prisma generate passa sem modelos financeiros.
- Test helpers nao referenciam tabelas financeiras.
- Schema baseline em banco vazio cria apenas Core.

### Checkpoint 6 - Docs finais e cleanup opcional de dependencias

- Atualizar `README.md`, `docs/architecture.md`, `docs/deployment.md`, `apps/api/README.md`, `apps/web/docs/frontend-boundaries.md` e docs `docs/ai/*` para Core/transicao.
- Remover promessas de dashboard financeiro e CRUD financeiro.
- Rodar denylist geral.
- Opcional: remover dependencias npm comprovadamente orfas.
- Se `package.json` mudar, atualizar lockfile e validar depois.

Validacao:

```bash
rg -n "finance|Finance|financeiro|Financeiro|account|Account|category|Category|subcategory|Subcategory|transaction|Transaction" apps packages docs README.md
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

Aceite:

- Ocorrencias restantes da denylist sao apenas historicas/legadas intencionais ou no proprio plano.
- Docs descrevem Core/transicao, nao produto financeiro nem produto futuro.
- Dependency cleanup, se feito, tem prova de nao uso e build/test verde.

## Denylist de simbolos financeiros

### Bloqueadores web apos Checkpoint 3

- `FinanceModulePage`
- `FinanceModuleContent`
- `FINANCE_MODULE_ROUTE`
- `FINANCE_TASK_COMMANDS`
- `financeQueryKeys`
- `accountsApi`
- `categoriesApi`
- `subcategoriesApi`
- `transactionsApi`
- `@/features/finance`
- `@/modules/finance`
- `@/types/finance`
- `MODULE_ROUTES.finance`
- `/financeiro`, exceto redirect legacy documentado se mantido

### Bloqueadores API apos Checkpoint 4

- `AccountsModule`
- `CategoriesModule`
- `SubcategoriesModule`
- `TransactionsModule`
- controllers/services/repositories/DTOs financeiros
- `ACCOUNT_TYPE`
- `TRANSACTION_TYPE`
- `mapAccountFromPersistence`
- `mapCategoryFromPersistence`
- `mapSubcategoryFromPersistence`
- `mapTransactionFromPersistence`
- `CreateAccountContract`
- `CreateCategoryContract`
- `CreateSubcategoryContract`
- `CreateTransactionContract`
- `TransactionContract`

### Bloqueadores contracts apos Checkpoint 2/4

- export publico de `./finance`
- `accountSchema`
- `categorySchema`
- `subcategorySchema`
- `transactionResourceSchema`
- `AccountType`
- `TransactionType`
- `CreateAccountInputContract`
- `CreateTransactionInputContract`

## Cobertura Core minima esperada

### Web

- `/login` renderiza como rota publica.
- `/` redireciona corretamente conforme autenticacao.
- `/app` e protegido.
- Logout redireciona para `/login`.
- Rota desconhecida retorna 404 ou comportamento definido.
- E2E smoke cobre login, `/app`, auth mock e rota desconhecida.

### API

- `GET /api/health/live`.
- `GET /api/health/ready`.
- `GET /api/auth/me` autenticado.
- Endpoint core protegido retorna 401 sem auth.
- Logout/cookie behavior preservado se ja coberto.
- Reset database/test setup nao depende de tabelas financeiras.

### Contracts

- Exports core/auth existem.
- Exports financeiros nao existem apos remocao.
- Web/api consomem contracts core sem importar `finance.ts`.

## Riscos

- Reset Prisma clean descarta continuidade de dados e historico financeiro; isso deve ser aceito explicitamente antes da execucao.
- Remover arquivos comuns inteiros pode quebrar auth; fazer extracao seletiva.
- Remover endpoints financeiros sem endpoint core protegido enfraquece testes de auth.
- Remover frontend finance antes de criar `/app` quebra entrada autenticada.
- Docs podem continuar mentindo se ficarem para o fim sem updates minimos no Checkpoint 1.
- Dependency cleanup antecipado pode apagar infraestrutura util para modulos futuros.
- Lockfile grande pode mascarar regressao; dependency cleanup deve ser final e opcional.

## O que nao sera feito agora

- Nao apagar arquivos.
- Nao alterar codigo de aplicacao.
- Nao alterar schema Prisma ou migrations.
- Nao alterar contracts.
- Nao implementar produto novo.
- Nao criar IA Dev OS, Jarvis, dashboard novo ou canvas.
- Nao mexer em arquivos reais de ambiente.
- Nao tocar em segredos.
- Nao remover configuracao essencial do monorepo, pnpm, Turbo, TypeScript, ESLint, Vite ou NestJS.
- Nao remover dependencias npm antes de prova de uso/orfandade depois da remocao.

## Perguntas em aberto

- Qual copy exata deve aparecer na tela neutra `/app`?
- `/financeiro` deve virar redirect para `/app`, 404 ou rota disabled com mensagem temporaria?
- Qual nome/shape do endpoint core protegido minimo na API?
- `packages/contracts/src/domain.ts` deve ser mantido como `core.ts`/`auth.ts` ou apenas reduzido no proprio arquivo?
- A command palette deve sobreviver vazia/generica ou ser removida temporariamente?
- Quais docs `docs/ai/*` devem ser preservadas como memoria historica e quais devem ser reescritas para Core?
