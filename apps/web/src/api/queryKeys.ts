export const authKeys = {
  root: ['auth'] as const,
  me: () => [...authKeys.root, 'me'] as const,
};

export const settingsKeys = {
  root: ['settings'] as const,
  overview: () => [...settingsKeys.root, 'overview'] as const,
};

export const usersKeys = {
  root: ['users'] as const,
  overview: () => [...usersKeys.root, 'overview'] as const,
};
