export const authKeys = {
  root: ['auth'] as const,
  me: () => [...authKeys.root, 'me'] as const,
};
