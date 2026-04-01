import { useState, useCallback, useMemo } from "react";
import {
  Category,
  Subcategory,
  Transaction,
  TransactionType,
  initialCategories,
  initialTransactions,
} from "@/data/mockData";

export function useFinanceStore() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addCategory = useCallback(
    (categoryName: string, subcategoryName: string, type: TransactionType = "expense") => {
      setCategories((prev) => {
        const existing = prev.find(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase()
        );
        if (existing) {
          const alreadyHasSub = existing.subcategories.some(
            (s) => s.name.toLowerCase() === subcategoryName.toLowerCase()
          );
          if (alreadyHasSub) return prev;
          const newSub: Subcategory = {
            id: `sub-${Date.now()}`,
            name: subcategoryName,
            categoryId: existing.id,
          };
          return prev.map((c) =>
            c.id === existing.id
              ? { ...c, subcategories: [...c.subcategories, newSub] }
              : c
          );
        }
        const catId = `cat-${Date.now()}`;
        const newCat: Category = {
          id: catId,
          name: categoryName,
          type,
          subcategories: [
            { id: `sub-${Date.now()}`, name: subcategoryName, categoryId: catId },
          ],
        };
        return [...prev, newCat];
      });
    },
    []
  );

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [
      { ...t, id: `t-${Date.now()}` },
      ...prev,
    ]);
  }, []);

  const getFilteredTransactions = useCallback(
    (year: number, month: number) =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
      }),
    [transactions]
  );

  const getCategoryName = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.name ?? "",
    [categories]
  );

  const getSubcategoryName = useCallback(
    (catId: string, subId: string) =>
      categories
        .find((c) => c.id === catId)
        ?.subcategories.find((s) => s.id === subId)?.name ?? "",
    [categories]
  );

  return {
    categories,
    transactions,
    addCategory,
    addTransaction,
    getFilteredTransactions,
    getCategoryName,
    getSubcategoryName,
  };
}
