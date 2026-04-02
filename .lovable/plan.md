

## Refatoração Profunda do Dashboard Financeiro

### Contexto
A estrutura atual já tem as 3 abas corretas (Dashboard/Transações/Categorias) e o botão "+ Nova Transação" abrindo um Sheet lateral. As mudanças focam em: trocar Sheet por Dialog centralizado, adicionar CRUD completo, filtros avançados na tabela, melhorias no CategoryManager, e feedback com toasts.

### Alterações por arquivo

**1. `src/hooks/useFinanceStore.ts` — Adicionar operações CRUD**
- `updateTransaction(id, data)` — atualiza uma transação existente
- `deleteTransaction(id)` — remove uma transação
- `updateCategory(id, newName)` — renomeia categoria
- `deleteCategory(id)` — remove categoria e suas transações
- `updateSubcategory(catId, subId, newName)` — renomeia subcategoria
- `deleteSubcategory(catId, subId)` — remove subcategoria
- `addCategory` retorna `boolean` ou `"duplicate"` para feedback de duplicidade

**2. `src/components/finance/TransactionForm.tsx` — Suporte a edição**
- Aceitar prop opcional `initialData?: Transaction` para pré-popular campos
- Aceitar prop `onSave` (renomear de `onAdd`) com assinatura unificada
- Layout compacto: campos agrupados em grid 2 colunas (Conta+Data, Descrição+Valor)
- Botão de salvar no rodapé com texto dinâmico ("Adicionar" vs "Salvar")

**3. `src/pages/Index.tsx` — Dialog centralizado em vez de Sheet**
- Trocar `Sheet` por `Dialog` (max-w-lg, overlay escuro)
- Adicionar estado `editingTransaction: Transaction | null` para modo edição
- Passar `initialData` ao `TransactionForm` quando editando
- Chamar `updateTransaction` ou `addTransaction` conforme o caso
- Toasts de sucesso: "Transação adicionada", "Transação atualizada"

**4. `src/components/finance/TransactionTable.tsx` — Filtros avançados + ações**
- Substituir input de busca simples por barra de filtros:
  - Dropdown múltiplo para Conta (Nubank, Mercado Pago)
  - Date range: dois date pickers (Data Inicial / Data Final)
  - Input texto para Descrição (busca parcial)
  - Dropdown para Categoria + Subcategoria dependente
- Coluna "Ações" com ícones Editar (Pencil) e Excluir (Trash2)
- Props novas: `onEdit(transaction)`, `onDelete(id)`, `categories`
- Dialog de confirmação para exclusão (AlertDialog)
- Toast ao excluir: "Transação removida"

**5. `src/components/finance/CategoryManager.tsx` — CRUD e melhorias visuais**
- Ícones de Editar/Excluir em cada card de categoria (visíveis no hover)
- Ícones de Editar/Excluir em cada subcategoria (visíveis no hover)
- Edição inline ou mini-dialog para renomear
- Confirmação antes de excluir
- Ordenação alfabética de categorias e subcategorias
- Aumentar fonte das subcategorias para `text-sm`
- Validação de duplicidade com toast de erro ("Esta categoria já existe")
- Toasts de sucesso para todas as operações

**6. Toasts (usando sonner)**
- Importar `toast` de `sonner` nos componentes que fazem operações
- Mensagens: "Transação adicionada", "Transação atualizada", "Transação removida", "Categoria adicionada", "Esta subcategoria já existe", etc.

### Estrutura final

```text
┌─────────────────────────────────────────────┐
│ Dashboard Financeiro          [+ Nova Trans] │
├─────────────────────────────────────────────┤
│ [Dashboard]  [Transações]  [Categorias]      │
├─────────────────────────────────────────────┤
│ Aba Dashboard: AdvancedAnalyticsPanel        │
│ Aba Transações: Filtros avançados + Tabela   │
│   com coluna Ações (editar/excluir)          │
│ Aba Categorias: Cards ordenados com CRUD     │
└─────────────────────────────────────────────┘

Modal centralizado (Dialog) para criar/editar transação
AlertDialog para confirmações de exclusão
Toasts para feedback de todas as operações
```

