# Contributing

Obrigado por contribuir com o `swiss-kit-dash-hub`.

## Configuração e comandos

Siga o [guia de configuração local](./docs/guides/local-setup.md). A [referência de comandos](./docs/reference/scripts.md) é a fonte de verdade para setup, banco, desenvolvimento e validação. Consulte também as [convenções do repositório](./docs/reference/repository-conventions.md).

## Fluxo de branches (sugestão)

Use `<type>/KAN-<número>-<descrição-curta>`, por exemplo:

- `feat/KAN-123-add-user-preferences`
- `fix/KAN-123-handle-empty-session`
- `chore/KAN-123-refresh-tooling`

## Convenção de commits

Use a chave do card seguida de um assunto no estilo Conventional Commits:

- `feat`
- `fix`
- `chore`
- `refactor`
- `docs`
- `test`

Exemplo:

```txt
KAN-123 feat(auth): describe the change
```

Títulos de Pull Request seguem o mesmo formato. Consulte as [convenções do repositório](./docs/reference/repository-conventions.md) para a referência completa.

## Antes de abrir PR

Execute `pnpm check` e, quando a alteração exigir a validação completa, `pnpm verify`. Consulte a [referência de comandos](./docs/reference/scripts.md) para os pré-requisitos e o comportamento de cada porta.

## Como abrir um Pull Request

1. Sincronize sua branch com `main`.
2. Abra PR com contexto claro e escopo objetivo.
3. Preencha o template de PR.
4. Liste como testar e riscos/impactos.
5. Aguarde CI verde antes do merge.
