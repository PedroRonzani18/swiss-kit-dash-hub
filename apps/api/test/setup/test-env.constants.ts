import path from 'node:path';

export const API_ROOT_DIR = path.resolve(__dirname, '../..');
export const RUNTIME_ENV_PATH = path.join(
  API_ROOT_DIR,
  'test',
  'setup',
  '.runtime-test-env.json',
);

export const DEFAULT_TEST_ENV = {
  NODE_ENV: 'test',
  PORT: '3001',
  JWT_SECRET: 'integration-test-secret',
  JWT_EXPIRES_IN: '1d',
  AUTH_COOKIE_NAME: 'swisskit_auth',
  AUTH_COOKIE_SAME_SITE: 'lax',
  AUTH_COOKIE_SECURE: 'false',
  WEB_APP_URL: 'http://localhost:8080',
  CORS_ALLOWED_ORIGINS: 'http://localhost:8080',
  GOOGLE_CLIENT_ID: 'integration-test-google-client-id',
  GOOGLE_CLIENT_SECRET: 'integration-test-google-client-secret',
  GOOGLE_CALLBACK_URL: 'http://localhost:3001/api/auth/google/callback',
} as const;

export type RuntimeTestEnv = {
  DATABASE_URL: string;
  TEST_DB_SCHEMA: string;
  TEST_BASE_DATABASE_URL: string;
};
