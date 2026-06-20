import { describe, expect, it } from "vitest";
import type { Transaction } from "@/types/finance";
import {
  getAvailableMonths,
  getAvailableYears,
  getFilteredTransactions,
  getMonthlyBreakdown,
} from "./analytics";

const makeTransaction = (
  id: string,
  date: string,
  amount: number,
  type: Transaction["type"] = "income",
): Transaction => ({
  id,
  accountId: "acc-1",
  accountName: "Conta",
  date,
  description: "Movimento",
  amount,
  type,
  categoryId: "cat-1",
  subcategoryId: "sub-1",
  isInstallment: false,
  installmentNumber: null,
  installmentTotal: null,
  installmentGroupId: null,
});

describe("analytics date filtering", () => {
  it("keeps April 1st transactions when filtering April/2026", () => {
    const transactions: Transaction[] = [
      makeTransaction("tx-mar", "2026-03-31", 100),
      makeTransaction("tx-apr-01", "2026-04-01", 850),
      makeTransaction("tx-apr-20", "2026-04-20", 1000),
    ];

    const availableYears = getAvailableYears(transactions);
    const availableMonths = getAvailableMonths(
      transactions,
      [2026],
      availableYears,
    );

    expect(availableYears).toEqual([2026]);
    expect(availableMonths).toEqual([2, 3]);

    const filteredTransactions = getFilteredTransactions(
      transactions,
      [2026],
      [3],
      ["cat-1"],
    );

    expect(filteredTransactions.map((transaction) => transaction.id)).toEqual([
      "tx-apr-01",
      "tx-apr-20",
    ]);
  });

  it("builds monthly breakdown with the correct month labels", () => {
    const filteredTransactions: Transaction[] = [
      makeTransaction("tx-apr-01", "2026-04-01", 850, "income"),
      makeTransaction("tx-apr-21", "2026-04-21", 300, "expense"),
    ];

    const monthlyBreakdown = getMonthlyBreakdown(filteredTransactions);

    expect(monthlyBreakdown).toHaveLength(1);
    expect(monthlyBreakdown[0]).toMatchObject({
      label: "Abr 2026",
      income: 850,
      expense: 300,
      sortKey: 202603,
    });
  });
});
