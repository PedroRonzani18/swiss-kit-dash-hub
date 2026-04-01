

## Plano: Painel de Análise Financeira Avançada

### O que será construído

Um novo componente **AdvancedAnalyticsPanel** dentro da aba "Relatórios", complementando o painel atual. Inspirado na planilha da imagem, com máxima customização.

### Funcionalidades

**1. Seleção multi-período**
- Seletor de anos (multi-select com checkboxes, ex: 2025, 2026)
- Seletor de meses (multi-select, pode escolher Jan+Fev+Mar juntos)
- Os dados são agregados pelos períodos selecionados

**2. Filtro de categorias**
- Multi-select com checkboxes para escolher quais categorias aparecem na análise
- Toggle rápido "Todas / Nenhuma"
- Filtro por tipo (Receita / Despesa / Ambos)

**3. Tabela hierárquica Categoria → Subcategoria (estilo árvore)**
- Categorias como linhas pai (colapsáveis/expandíveis)
- Subcategorias indentadas abaixo
- Colunas: Nome, Valor Total, % do Total, Barra de progresso visual proporcional
- Separação em 3 seções: **Income**, **Expense**, **Net Savings** (como na planilha)
- Totais gerais por seção

**4. Resumo por mês (breakdown temporal)**
- Tabela com colunas: Mês, Receita, Despesa, Saldo Líquido
- Total geral na última linha
- Barras visuais proporcionais (como na planilha)

**5. Estatísticas extras**
- Média mensal de gastos/receitas
- Maior gasto individual do período
- Categoria com maior crescimento % entre meses
- Taxa de economia (Net Savings / Income %)

### Detalhes técnicos

**Arquivos modificados/criados:**
1. **`src/components/finance/AdvancedAnalyticsPanel.tsx`** — Novo componente principal com toda a lógica
2. **`src/pages/Index.tsx`** — Alterar filtros (multi-select de anos e meses) e passar `transactions` completas (sem filtro) para o painel avançado, delegando a filtragem ao componente
3. **`src/data/mockData.ts`** — Adicionar transações em Jan e Fev 2026 para ter dados multi-mês
4. **`src/components/finance/AnalyticsPanel.tsx`** — Manter como está (visão do mês único), mas adicionar sub-tab ou accordion para alternar entre visão simples e avançada

**Estrutura do AdvancedAnalyticsPanel:**
- Estado local: `selectedYears`, `selectedMonths`, `selectedCategoryIds`, `expandedCategories`
- Barra de filtros no topo com Popovers de multi-select (usando Checkbox do shadcn)
- Seção "Breakdown por Categoria" — tabela com Collapsible rows
- Seção "Breakdown por Mês" — tabela com barras
- Seção "Indicadores" — cards com médias, taxa de economia, etc.
- Todos os valores formatados em BRL

**Abordagem de UI:**
- Sub-tabs dentro de "Relatórios": **Visão Geral** (painel atual) | **Análise Avançada** (novo)
- Dark mode consistente com o resto do app

