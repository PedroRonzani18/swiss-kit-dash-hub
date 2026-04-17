import { useEffect, useMemo, useRef, useState } from "react";
import type { Category, Transaction } from "@/types/finance";

export type AnalyticsTypeFilter = "all" | "income" | "expense";

type SubcategoryBreakdown = {
  id: string;
  name: string;
  total: number;
};

type CategoryBreakdownEntry = {
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

const MONTH_NAMES = [
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

export function useAdvancedAnalytics(
  transactions: Transaction[],
  categories: Category[],
  getSubcategoryName: (catId: string, subId: string) => string,
) {
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [typeFilter, setTypeFilter] = useState<AnalyticsTypeFilter>("all");
  const hasInitializedYears = useRef(false);
  const hasInitializedMonths = useRef(false);
  const hasInitializedCategories = useRef(false);

  const availableYears = useMemo(() => {
    return Array.from(
      new Set(
        transactions.map(transaction => {
          const date = new Date(transaction.date);
          return date.getFullYear();
        }),
      ),
    ).sort((a, b) => a - b);
  }, [transactions]);

  const availableMonths = useMemo(() => {
    if (transactions.length === 0) {
      return [];
    }

    const yearScope = selectedYears.length > 0 ? selectedYears : availableYears;
    const yearScopeSet = new Set(yearScope);

    return Array.from(
      new Set(
        transactions
          .filter(transaction => {
            const date = new Date(transaction.date);
            return yearScopeSet.has(date.getFullYear());
          })
          .map(transaction => {
            const date = new Date(transaction.date);
            return date.getMonth();
          }),
      ),
    ).sort((a, b) => a - b);
  }, [transactions, selectedYears, availableYears]);

  useEffect(() => {
    setSelectedYears(previousYears => {
      const validYears = previousYears.filter(year =>
        availableYears.includes(year),
      );

      if (!hasInitializedYears.current && availableYears.length > 0) {
        hasInitializedYears.current = true;
        return [...availableYears];
      }

      return validYears;
    });
  }, [availableYears]);

  useEffect(() => {
    setSelectedMonths(previousMonths => {
      const validMonths = previousMonths.filter(month =>
        availableMonths.includes(month),
      );

      if (!hasInitializedMonths.current && availableMonths.length > 0) {
        hasInitializedMonths.current = true;
        return [...availableMonths];
      }

      return validMonths;
    });
  }, [availableMonths]);

  useEffect(() => {
    const categoryIds = categories.map(category => category.id);

    setSelectedCategoryIds(previousCategoryIds => {
      const validCategoryIds = previousCategoryIds.filter(id =>
        categoryIds.includes(id),
      );

      if (!hasInitializedCategories.current && categoryIds.length > 0) {
        hasInitializedCategories.current = true;
        return [...categoryIds];
      }

      return validCategoryIds;
    });
  }, [categories]);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return (
          selectedYears.includes(date.getFullYear()) &&
          selectedMonths.includes(date.getMonth()) &&
          selectedCategoryIds.includes(transaction.categoryId)
        );
      }),
    [transactions, selectedYears, selectedMonths, selectedCategoryIds],
  );

  const totalIncome = useMemo(
    () =>
      filteredTransactions
        .filter(transaction => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    [filteredTransactions],
  );

  const totalExpense = useMemo(
    () =>
      filteredTransactions
        .filter(transaction => transaction.type === "expense")
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    [filteredTransactions],
  );

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  const categoryBreakdown: CategoryBreakdown = useMemo(() => {
    const incomeCategories: CategoryBreakdownEntry[] = [];
    const expenseCategories: CategoryBreakdownEntry[] = [];

    categories
      .filter(category => selectedCategoryIds.includes(category.id))
      .forEach(category => {
        const categoryTransactions = filteredTransactions.filter(
          transaction => transaction.categoryId === category.id,
        );
        if (categoryTransactions.length === 0) {
          return;
        }

        const total = categoryTransactions.reduce(
          (sum, transaction) => sum + transaction.amount,
          0,
        );
        const subcategoryTotals = new Map<string, number>();

        categoryTransactions.forEach(transaction => {
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
  }, [filteredTransactions, categories, selectedCategoryIds, getSubcategoryName]);

  const monthlyBreakdown: MonthlyBreakdownEntry[] = useMemo(() => {
    const map = new Map<string, MonthlyBreakdownEntry>();
    filteredTransactions.forEach(transaction => {
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
  }, [filteredTransactions]);

  const extraStats = useMemo(() => {
    const numMonths = monthlyBreakdown.length || 1;
    const avgExpense = totalExpense / numMonths;
    const avgIncome = totalIncome / numMonths;
    const biggestExpense = filteredTransactions
      .filter(transaction => transaction.type === "expense")
      .sort((a, b) => b.amount - a.amount)[0];

    return { avgExpense, avgIncome, biggestExpense, numMonths };
  }, [filteredTransactions, totalExpense, totalIncome, monthlyBreakdown]);

  const maxMonthlyValue = Math.max(
    ...monthlyBreakdown.map(month =>
      Math.max(month.income, month.expense),
    ),
    1,
  );

  const toggleYear = (year: number) => {
    setSelectedYears(previous =>
      previous.includes(year)
        ? previous.filter(value => value !== year)
        : [...previous, year],
    );
  };

  const toggleMonth = (month: number) => {
    setSelectedMonths(previous =>
      previous.includes(month)
        ? previous.filter(value => value !== month)
        : [...previous, month],
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds(previous =>
      previous.includes(categoryId)
        ? previous.filter(value => value !== categoryId)
        : [...previous, categoryId],
    );
  };

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(previous => {
      const next = new Set(previous);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }

      return next;
    });
  };

  const selectAllMonths = () => setSelectedMonths([...availableMonths]);
  const clearMonths = () => setSelectedMonths([]);
  const selectAllCategories = () =>
    setSelectedCategoryIds(categories.map(category => category.id));
  const clearCategories = () => setSelectedCategoryIds([]);

  return {
    selectedYears,
    selectedMonths,
    selectedCategoryIds,
    expandedCategories,
    typeFilter,
    setTypeFilter,
    availableYears,
    availableMonths,
    categoryBreakdown,
    monthlyBreakdown,
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    extraStats,
    maxMonthlyValue,
    toggleYear,
    toggleMonth,
    toggleCategory,
    toggleExpanded,
    selectAllMonths,
    clearMonths,
    selectAllCategories,
    clearCategories,
  };
}
