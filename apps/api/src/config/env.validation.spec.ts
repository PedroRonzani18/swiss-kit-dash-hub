import { validateEnv } from './env.validation';

const validConfig = {
  JWT_SECRET: 'test-secret',
  GOOGLE_CLIENT_ID: 'google-client-id',
  GOOGLE_CLIENT_SECRET: 'google-client-secret',
  GOOGLE_CALLBACK_URL: 'http://localhost:3001/api/auth/google/callback',
};

describe('validateEnv', () => {
  it('does not require or expose the seed-only initial administrator email', () => {
    expect(validateEnv(validConfig)).not.toHaveProperty('INITIAL_ADMIN_EMAIL');
    expect(() => validateEnv(validConfig)).not.toThrow();
  });
});
