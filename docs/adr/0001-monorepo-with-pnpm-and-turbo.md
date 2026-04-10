# ADR 0001: Monorepo com pnpm e Turbo

## Contexto
O projeto possui frontend (`apps/web`), backend (`apps/api`) e contratos compartilhados (`packages/contracts`) com evolução contínua e mudanças coordenadas entre camadas.

Era necessário:
- reduzir custo de sincronização entre web e API;
- padronizar execução de build/test/lint/typecheck;
- manter uma base única para CI e contribuição.

## Decisão
Adotar monorepo com:
- `pnpm` workspaces para gerenciamento de dependências e pacotes locais;
- `turbo` para orquestração de tasks por pacote, com filtros e pipeline único.

Estrutura padrão:
- `apps/*` para aplicações executáveis;
- `packages/*` para componentes compartilhados.

## Consequências
Positivas:
- fluxo de desenvolvimento e CI mais consistente;
- compartilhamento simplificado de contratos e configuração;
- execução segmentada por app (`--filter`) sem perder visão do todo.

Trade-offs:
- maior necessidade de disciplina em dependências e fronteiras entre pacotes;
- curva inicial de tooling para quem vem de repositórios isolados.
