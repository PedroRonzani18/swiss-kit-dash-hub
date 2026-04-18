import { useMemo, useState } from "react";
import type { Category, Transaction } from "@/types/finance";

type UseTransactionTableFiltersArgs = {
  transactions: Transaction[];
  categories: Category[];
};

const toLocalDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function useTransactionTableFilters({
  transactions,
  categories,
}: UseTransactionTableFiltersArgs) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterSubcategoryId, setFilterSubcategoryId] = useState("");

  const filterCategory = useMemo(
    () => categories.find(category => category.id === filterCategoryId),
    [categories, filterCategoryId],
  );

  const filteredTransactions = useMemo(() => {
    const result = transactions.filter(transaction => {
      if (
        search &&
        !transaction.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (
        selectedAccounts.length > 0 &&
        !selectedAccounts.includes(transaction.accountId)
      ) {
        return false;
      }
      if (dateFrom && transaction.date < toLocalDateStr(dateFrom)) {
        return false;
      }
      if (dateTo && transaction.date > toLocalDateStr(dateTo)) {
        return false;
      }
      if (filterCategoryId && transaction.categoryId !== filterCategoryId) {
        return false;
      }
      if (
        filterSubcategoryId &&
        transaction.subcategoryId !== filterSubcategoryId
      ) {
        return false;
      }

      return true;
    });

    result.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortAsc ? diff : -diff;
    });

    return result;
  }, [
    transactions,
    search,
    sortAsc,
    selectedAccounts,
    dateFrom,
    dateTo,
    filterCategoryId,
    filterSubcategoryId,
  ]);

  const hasFilters = Boolean(
    search || selectedAccounts.length > 0 || dateFrom || dateTo || filterCategoryId,
  );

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts(previous =>
      previous.includes(accountId)
        ? previous.filter(value => value !== accountId)
        : [...previous, accountId],
    );
  };

  const handleCategoryChange = (value: string) => {
    setFilterCategoryId(value === "all" ? "" : value);
    setFilterSubcategoryId("");
  };

  const handleSubcategoryChange = (value: string) => {
    setFilterSubcategoryId(value === "all" ? "" : value);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedAccounts([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    setFilterCategoryId("");
    setFilterSubcategoryId("");
  };

  return {
    search,
    setSearch,
    sortAsc,
    setSortAsc,
    selectedAccounts,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    filterCategoryId,
    filterSubcategoryId,
    filterCategory,
    filteredTransactions,
    hasFilters,
    toggleAccount,
    handleCategoryChange,
    handleSubcategoryChange,
    clearFilters,
  };
}
