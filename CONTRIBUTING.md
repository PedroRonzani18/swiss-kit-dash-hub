# Contributing

Obrigado por contribuir com o `swiss-kit-dash-hub`.

## Pré-requisitos

- Node.js 22+
- pnpm 10+

## Instalação

```bash
pnpm install
```

## Como rodar localmente

Frontend (`apps/web`):

```bash
pnpm dev:web
```

Backend (`apps/api`):

```bash
pnpm dev:api
```

## Fluxo de branches (sugestão)

Use nomes curtos e descritivos, por exemplo:

- `feat/<descricao-curta>`
- `fix/<descricao-curta>`
- `chore/<descricao-curta>`
- `refactor/<descricao-curta>`
- `docs/<descricao-curta>`
- `test/<descricao-curta>`

## Convenção de commits

Preferencialmente siga Conventional Commits com os tipos abaixo:

- `feat`
- `fix`
- `chore`
- `refactor`
- `docs`
- `test`

Exemplo:

```txt
feat(auth): add refresh token flow
```

## Antes de abrir PR

Garanta CI localmente:

```bash
pnpm lint
pnpm test
pnpm build
```

Para validar o monorepo completo (web + api):

```bash
pnpm lint:ci
pnpm typecheck
pnpm test:ci
pnpm build:ci
```

## Como abrir um Pull Request

1. Sincronize sua branch com `main`.
2. Abra PR com contexto claro e escopo objetivo.
3. Preencha o template de PR.
4. Liste como testar e riscos/impactos.
5. Aguarde CI verde antes do merge.
