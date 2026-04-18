import { useEffect, useMemo, useRef, useState } from "react";
import type { Category, Transaction } from "@/types/finance";
import {
  getAvailableMonths,
  getAvailableYears,
  getCategoryBreakdown,
  getExtraStats,
  getFilteredTransactions,
  getMaxMonthlyValue,
  getMonthlyBreakdown,
  getTotalExpense,
  getTotalIncome,
  type AnalyticsTypeFilter,
} from "@/features/finance/model/analytics";

export type { CategoryBreakdown, MonthlyBreakdownEntry } from "@/features/finance/model/analytics";

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

  const availableYears = useMemo(
    () => getAvailableYears(transactions),
    [transactions],
  );

  const availableMonths = useMemo(
    () => getAvailableMonths(transactions, selectedYears, availableYears),
    [transactions, selectedYears, availableYears],
  );

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
      getFilteredTransactions(
        transactions,
        selectedYears,
        selectedMonths,
        selectedCategoryIds,
      ),
    [transactions, selectedYears, selectedMonths, selectedCategoryIds],
  );

  const totalIncome = useMemo(
    () => getTotalIncome(filteredTransactions),
    [filteredTransactions],
  );

  const totalExpense = useMemo(
    () => getTotalExpense(filteredTransactions),
    [filteredTransactions],
  );

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  const categoryBreakdown = useMemo(
    () =>
      getCategoryBreakdown(
        filteredTransactions,
        categories,
        selectedCategoryIds,
        getSubcategoryName,
      ),
    [filteredTransactions, categories, selectedCategoryIds, getSubcategoryName],
  );

  const monthlyBreakdown = useMemo(
    () => getMonthlyBreakdown(filteredTransactions),
    [filteredTransactions],
  );

  const extraStats = useMemo(
    () =>
      getExtraStats(
        filteredTransactions,
        totalExpense,
        totalIncome,
        monthlyBreakdown,
      ),
    [filteredTransactions, totalExpense, totalIncome, monthlyBreakdown],
  );

  const maxMonthlyValue = useMemo(
    () => getMaxMonthlyValue(monthlyBreakdown),
    [monthlyBreakdown],
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
