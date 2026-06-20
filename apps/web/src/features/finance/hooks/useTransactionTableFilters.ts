import { useMemo, useState } from "react";
import type { Category, Transaction, TransactionType } from "@/types/finance";

type UseTransactionTableFiltersArgs = {
  transactions: Transaction[];
  categories: Category[];
};

type TableFilterType = "" | TransactionType;

type TransactionTableFilterInput = {
  search: string;
  sortAsc: boolean;
  selectedAccounts: string[];
  dateFrom?: Date;
  dateTo?: Date;
  filterCategoryId: string;
  filterSubcategoryId: string;
  filterType: TableFilterType;
};

const toLocalDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function applyTransactionTableFilters(
  transactions: Transaction[],
  filters: TransactionTableFilterInput,
): Transaction[] {
  const {
    search,
    sortAsc,
    selectedAccounts,
    dateFrom,
    dateTo,
    filterCategoryId,
    filterSubcategoryId,
    filterType,
  } = filters;

  const normalizedSearch = search.toLowerCase();

  const result = transactions.filter((transaction) => {
    if (
      search &&
      !transaction.description.toLowerCase().includes(normalizedSearch)
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
    if (filterType && transaction.type !== filterType) {
      return false;
    }

    return true;
  });

  result.sort((a, b) => {
    if (sortAsc) {
      return a.date.localeCompare(b.date);
    }

    return b.date.localeCompare(a.date);
  });

  return result;
}

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
  const [filterType, setFilterType] = useState<TableFilterType>("");

  const filterCategory = useMemo(
    () => categories.find(category => category.id === filterCategoryId),
    [categories, filterCategoryId],
  );

  const filteredTransactions = useMemo(() => {
    return applyTransactionTableFilters(transactions, {
      search,
      sortAsc,
      selectedAccounts,
      dateFrom,
      dateTo,
      filterCategoryId,
      filterSubcategoryId,
      filterType,
    });
  }, [
    transactions,
    search,
    sortAsc,
    selectedAccounts,
    dateFrom,
    dateTo,
    filterCategoryId,
    filterSubcategoryId,
    filterType,
  ]);

  const hasFilters = Boolean(
    search ||
      selectedAccounts.length > 0 ||
      dateFrom ||
      dateTo ||
      filterCategoryId ||
      filterSubcategoryId ||
      filterType,
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
    setFilterType("");
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
    filterType,
    setFilterType,
    setSelectedAccounts,
    setFilterCategoryId,
    setFilterSubcategoryId,
    filterCategory,
    filteredTransactions,
    hasFilters,
    toggleAccount,
    handleCategoryChange,
    handleSubcategoryChange,
    clearFilters,
  };
}
