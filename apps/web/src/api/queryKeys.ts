export const authKeys = {
  root: ['auth'] as const,
  me: () => [...authKeys.root, 'me'] as const,
};

export const settingsKeys = {
  root: ['settings'] as const,
  overview: () => [...settingsKeys.root, 'overview'] as const,
};
