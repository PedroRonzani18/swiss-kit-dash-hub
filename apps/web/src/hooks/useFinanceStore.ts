import { useState, useCallback } from "react";
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
    (categoryName: string, subcategoryName: string, type: TransactionType = "expense"): "duplicate" | "success" => {
      let result: "duplicate" | "success" = "success";
      setCategories((prev) => {
        const existing = prev.find(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase()
        );
        if (existing) {
          const alreadyHasSub = existing.subcategories.some(
            (s) => s.name.toLowerCase() === subcategoryName.toLowerCase()
          );
          if (alreadyHasSub) {
            result = "duplicate";
            return prev;
          }
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
      return result;
    },
    []
  );

  const updateCategory = useCallback((id: string, newName: string): "duplicate" | "success" => {
    let result: "duplicate" | "success" = "success";
    setCategories((prev) => {
      const duplicate = prev.find(
        (c) => c.id !== id && c.name.toLowerCase() === newName.toLowerCase()
      );
      if (duplicate) {
        result = "duplicate";
        return prev;
      }
      return prev.map((c) => (c.id === id ? { ...c, name: newName } : c));
    });
    return result;
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setTransactions((prev) => prev.filter((t) => t.categoryId !== id));
  }, []);

  const updateSubcategory = useCallback((catId: string, subId: string, newName: string): "duplicate" | "success" => {
    let result: "duplicate" | "success" = "success";
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        const duplicate = c.subcategories.find(
          (s) => s.id !== subId && s.name.toLowerCase() === newName.toLowerCase()
        );
        if (duplicate) {
          result = "duplicate";
          return c;
        }
        return {
          ...c,
          subcategories: c.subcategories.map((s) =>
            s.id === subId ? { ...s, name: newName } : s
          ),
        };
      })
    );
    return result;
  }, []);

  const deleteSubcategory = useCallback((catId: string, subId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, subcategories: c.subcategories.filter((s) => s.id !== subId) }
          : c
      )
    );
    setTransactions((prev) => prev.filter((t) => t.subcategoryId !== subId));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [
      { ...t, id: `t-${Date.now()}` },
      ...prev,
    ]);
  }, []);

  const updateTransaction = useCallback((id: string, data: Omit<Transaction, "id">) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

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
    updateCategory,
    deleteCategory,
    updateSubcategory,
    deleteSubcategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCategoryName,
    getSubcategoryName,
  };
}
