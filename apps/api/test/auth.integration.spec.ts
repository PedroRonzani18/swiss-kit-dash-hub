import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/prisma/prisma.service';
import { createAuthenticatedTestUser } from './helpers/auth.helper';
import { resetDatabase } from './helpers/database.helper';
import { createIntegrationTestApp } from './helpers/test-app.helper';

describe('Auth integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testApp = await createIntegrationTestApp();
    app = testApp.app;
    prisma = testApp.prisma;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await resetDatabase(prisma);
  });

  it('denies access to protected routes without authentication', async () => {
    const protectedRoutes = [
      '/api/auth/me',
      '/api/accounts',
      '/api/categories',
      '/api/subcategories',
      '/api/transactions',
    ];

    for (const route of protectedRoutes) {
      await request(app.getHttpServer()).get(route).expect(401);
    }
  });

  it('returns authenticated user on GET /api/auth/me', async () => {
    const authUser = await createAuthenticatedTestUser(app, prisma);

    const response = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set(authUser.authHeader)
      .expect(200);

    expect(response.body).toMatchObject({
      id: authUser.user.id,
      email: authUser.user.email,
      name: authUser.user.name,
      provider: authUser.user.provider,
    });
  });
});
