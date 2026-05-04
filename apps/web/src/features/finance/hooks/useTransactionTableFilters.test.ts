import { describe, expect, it } from "vitest";
import type { Transaction } from "@/types/finance";
import { applyTransactionTableFilters } from "./useTransactionTableFilters";

const makeTransaction = (
  id: string,
  date: string,
  type: Transaction["type"],
  categoryId = "cat-1",
): Transaction => ({
  id,
  accountId: "acc-1",
  accountName: "Conta",
  date,
  description: id,
  amount: 100,
  type,
  categoryId,
  subcategoryId: "sub-1",
});

describe("useTransactionTableFilters helpers", () => {
  it("filters by type and keeps behavior cumulative with date/category filters", () => {
    const transactions: Transaction[] = [
      makeTransaction("tx-income-apr1", "2026-04-01", "income", "cat-1"),
      makeTransaction("tx-expense-apr1", "2026-04-01", "expense", "cat-1"),
      makeTransaction("tx-income-may", "2026-05-10", "income", "cat-2"),
    ];

    const filtered = applyTransactionTableFilters(transactions, {
      search: "",
      sortAsc: true,
      selectedAccounts: [],
      dateFrom: new Date("2026-04-01T12:00:00"),
      dateTo: new Date("2026-04-30T12:00:00"),
      filterCategoryId: "cat-1",
      filterSubcategoryId: "",
      filterType: "income",
    });

    expect(filtered.map((transaction) => transaction.id)).toEqual([
      "tx-income-apr1",
    ]);
  });
});
