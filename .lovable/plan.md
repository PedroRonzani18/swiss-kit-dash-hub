

## Refatoração UX do Dashboard Financeiro

### Resumo
Simplificar a tela: remover formulário fixo e filtros externos, reorganizar abas, e promover o painel avançado como visualização principal.

### Alterações

**1. `src/pages/Index.tsx` — Reescrita principal**
- Remover import de `TransactionForm` inline, `Select`, `AnalyticsPanel`, e estados `year`/`month`/`filteredTx`
- Adicionar estado `showTransactionModal` (boolean)
- Header: título à esquerda + botão `+ Nova Transação` à direita (abre modal)
- Remover filtros externos (seletor de ano + barra de meses)
- Tabs: `dashboard` (default), `transactions`, `categories`
- Tab "Dashboard": renderiza `AdvancedAnalyticsPanel` diretamente (com `transactions` completas)
- Tab "Transações": renderiza `TransactionTable` com `transactions` (todas, sem filtro externo — a tabela já tem busca interna)
- Tab "Categorias": mantém `CategoryManager`
- Modal/Sheet: usar `Sheet` (side="right") com `TransactionForm` dentro

**2. `src/components/finance/TransactionForm.tsx` — Sem mudanças estruturais**
- Componente já funciona isolado, será apenas renderizado dentro do Sheet

**3. Componentes removidos da página (não deletados):**
- `AnalyticsPanel` — não mais usado em Index (pode manter arquivo caso reutilize)

**4. Nenhuma alteração no `AdvancedAnalyticsPanel`** — já tem filtros internos de ano/mês/categoria

### Estrutura final da página

```text
┌─────────────────────────────────────────────┐
│ Dashboard Financeiro          [+ Nova Trans] │
│ Gerencie suas finanças...                    │
├─────────────────────────────────────────────┤
│ [Dashboard]  [Transações]  [Categorias]      │
├─────────────────────────────────────────────┤
│                                              │
│   (conteúdo da aba ativa)                    │
│                                              │
└─────────────────────────────────────────────┘
```

