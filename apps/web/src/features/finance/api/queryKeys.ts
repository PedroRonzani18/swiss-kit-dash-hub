export const financeQueryKeys = {
  root: ["finance"] as const,
  accounts: () => [...financeQueryKeys.root, "accounts"] as const,
  categories: () => [...financeQueryKeys.root, "categories"] as const,
  subcategories: () => [...financeQueryKeys.root, "subcategories"] as const,
  transactions: () => [...financeQueryKeys.root, "transactions"] as const,
};
