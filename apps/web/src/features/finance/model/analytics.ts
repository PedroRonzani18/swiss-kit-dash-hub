import type { Category, Transaction } from "@/types/finance";

export type AnalyticsTypeFilter = "all" | "income" | "expense";

type SubcategoryBreakdown = {
  id: string;
  name: string;
  total: number;
};

export type CategoryBreakdownEntry = {
  cat: Category;
  total: number;
  subs: SubcategoryBreakdown[];
};

export type CategoryBreakdown = {
  incomeCategories: CategoryBreakdownEntry[];
  expenseCategories: CategoryBreakdownEntry[];
};

export type MonthlyBreakdownEntry = {
  label: string;
  income: number;
  expense: number;
  sortKey: number;
};

export const MONTH_NAMES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function getAvailableYears(transactions: Transaction[]): number[] {
  return Array.from(
    new Set(
      transactions.map((transaction) => {
        const date = new Date(transaction.date);
        return date.getFullYear();
      }),
    ),
  ).sort((a, b) => a - b);
}

export function getAvailableMonths(
  transactions: Transaction[],
  selectedYears: number[],
  availableYears: number[],
): number[] {
  if (transactions.length === 0) {
    return [];
  }

  const yearScope = selectedYears.length > 0 ? selectedYears : availableYears;
  const yearScopeSet = new Set(yearScope);

  return Array.from(
    new Set(
      transactions
        .filter((transaction) => {
          const date = new Date(transaction.date);
          return yearScopeSet.has(date.getFullYear());
        })
        .map((transaction) => {
          const date = new Date(transaction.date);
          return date.getMonth();
        }),
    ),
  ).sort((a, b) => a - b);
}

export function getFilteredTransactions(
  transactions: Transaction[],
  selectedYears: number[],
  selectedMonths: number[],
  selectedCategoryIds: string[],
): Transaction[] {
  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return (
      selectedYears.includes(date.getFullYear()) &&
      selectedMonths.includes(date.getMonth()) &&
      selectedCategoryIds.includes(transaction.categoryId)
    );
  });
}

export function getTotalIncome(filteredTransactions: Transaction[]): number {
  return filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function getTotalExpense(filteredTransactions: Transaction[]): number {
  return filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function getCategoryBreakdown(
  filteredTransactions: Transaction[],
  categories: Category[],
  selectedCategoryIds: string[],
  getSubcategoryName: (catId: string, subId: string) => string,
): CategoryBreakdown {
  const incomeCategories: CategoryBreakdownEntry[] = [];
  const expenseCategories: CategoryBreakdownEntry[] = [];

  categories
    .filter((category) => selectedCategoryIds.includes(category.id))
    .forEach((category) => {
      const categoryTransactions = filteredTransactions.filter(
        (transaction) => transaction.categoryId === category.id,
      );
      if (categoryTransactions.length === 0) {
        return;
      }

      const total = categoryTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0,
      );
      const subcategoryTotals = new Map<string, number>();

      categoryTransactions.forEach((transaction) => {
        subcategoryTotals.set(
          transaction.subcategoryId,
          (subcategoryTotals.get(transaction.subcategoryId) || 0) +
            transaction.amount,
        );
      });

      const subs = Array.from(subcategoryTotals.entries())
        .map(([subId, subTotal]) => ({
          id: subId,
          name: getSubcategoryName(category.id, subId),
          total: subTotal,
        }))
        .sort((a, b) => b.total - a.total);

      const entry = { cat: category, total, subs };
      if (category.type === "income") {
        incomeCategories.push(entry);
        return;
      }

      expenseCategories.push(entry);
    });

  incomeCategories.sort((a, b) => b.total - a.total);
  expenseCategories.sort((a, b) => b.total - a.total);

  return { incomeCategories, expenseCategories };
}

export function getMonthlyBreakdown(
  filteredTransactions: Transaction[],
): MonthlyBreakdownEntry[] {
  const map = new Map<string, MonthlyBreakdownEntry>();
  filteredTransactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
    const sortKey = date.getFullYear() * 100 + date.getMonth();

    if (!map.has(key)) {
      map.set(key, { label, income: 0, expense: 0, sortKey });
    }

    const entry = map.get(key);
    if (!entry) {
      return;
    }

    if (transaction.type === "income") {
      entry.income += transaction.amount;
    } else {
      entry.expense += transaction.amount;
    }
  });

  return Array.from(map.values()).sort((a, b) => a.sortKey - b.sortKey);
}

export function getExtraStats(
  filteredTransactions: Transaction[],
  totalExpense: number,
  totalIncome: number,
  monthlyBreakdown: MonthlyBreakdownEntry[],
) {
  const numMonths = monthlyBreakdown.length || 1;
  const avgExpense = totalExpense / numMonths;
  const avgIncome = totalIncome / numMonths;
  const biggestExpense = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .sort((a, b) => b.amount - a.amount)[0];

  return { avgExpense, avgIncome, biggestExpense, numMonths };
}

export function getMaxMonthlyValue(
  monthlyBreakdown: MonthlyBreakdownEntry[],
): number {
  return Math.max(
    ...monthlyBreakdown.map((month) => Math.max(month.income, month.expense)),
    1,
  );
}
