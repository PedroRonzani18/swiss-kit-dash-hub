const baseConfig = require('./jest.config.js');

module.exports = {
  ...baseConfig,
  testMatch: ['<rootDir>/test/**/*.integration.spec.ts'],
  testPathIgnorePatterns: [],
  setupFilesAfterEnv: ['<rootDir>/test/setup/load-test-env.ts'],
  globalSetup: '<rootDir>/test/setup/global-setup.ts',
  globalTeardown: '<rootDir>/test/setup/global-teardown.ts',
};
