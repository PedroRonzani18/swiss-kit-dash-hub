export const IGNORED_IDENTIFIER_PATTERN = '^_';

export const createUnusedVarsRule = ({ ignoreRestSiblings = false } = {}) => [
  'error',
  {
    argsIgnorePattern: IGNORED_IDENTIFIER_PATTERN,
    varsIgnorePattern: IGNORED_IDENTIFIER_PATTERN,
    caughtErrorsIgnorePattern: IGNORED_IDENTIFIER_PATTERN,
    ...(ignoreRestSiblings ? { ignoreRestSiblings: true } : {}),
  },
];
