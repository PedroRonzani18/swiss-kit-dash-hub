export const authKeys = {
  root: ['auth'] as const,
  me: () => [...authKeys.root, 'me'] as const,
};

export const financeKeys = {
  root: ['finance'] as const,
  accounts: () => [...financeKeys.root, 'accounts'] as const,
  categories: () => [...financeKeys.root, 'categories'] as const,
  subcategories: () => [...financeKeys.root, 'subcategories'] as const,
  transactions: () => [...financeKeys.root, 'transactions'] as const,
};
