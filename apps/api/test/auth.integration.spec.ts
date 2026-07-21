import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
      '/api/core/session-check',
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

  it('returns authenticated status on GET /api/core/session-check', async () => {
    const authUser = await createAuthenticatedTestUser(app, prisma, {
      permissions: ['core:access'],
    });

    const response = await request(app.getHttpServer())
      .get('/api/core/session-check')
      .set(authUser.authHeader)
      .expect(200);

    expect(response.body).toEqual({
      status: 'authenticated',
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        name: authUser.user.name,
        provider: authUser.user.provider,
      },
    });
  });

  it('denies a previously authenticated user after deactivation', async () => {
    const authUser = await createAuthenticatedTestUser(app, prisma, {
      permissions: ['core:access'],
    });

    await prisma.user.update({
      where: { id: authUser.user.id },
      data: { isActive: false },
    });

    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set(authUser.authHeader)
      .expect(401);

    await request(app.getHttpServer())
      .get('/api/core/session-check')
      .set(authUser.authHeader)
      .expect(401);
  });

  it('keeps a token invalid after deactivation and reactivation', async () => {
    const actor = await createAuthenticatedTestUser(app, prisma, {
      permissions: ['users:update'],
    });
    const authUser = await createAuthenticatedTestUser(app, prisma, {
      permissions: ['core:access'],
    });

    await request(app.getHttpServer())
      .patch(`/api/users/${authUser.user.id}/status`)
      .set(actor.authHeader)
      .send({ isActive: false })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/users/${authUser.user.id}/status`)
      .set(actor.authHeader)
      .send({ isActive: true })
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set(authUser.authHeader)
      .expect(401);

    const currentUser = await prisma.user.findUniqueOrThrow({
      where: { id: authUser.user.id },
    });
    const jwtService = app.get(JwtService);
    const currentToken = await jwtService.signAsync({
      sub: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
      provider: currentUser.provider,
      sessionVersion: currentUser.sessionVersion,
    });

    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${currentToken}`)
      .expect(200);
  });

  it('accepts a legacy token while the user session version is zero', async () => {
    const authUser = await createAuthenticatedTestUser(app, prisma);
    const jwtService = app.get(JwtService);
    const legacyToken = await jwtService.signAsync({
      sub: authUser.user.id,
      email: authUser.user.email,
      name: authUser.user.name,
      provider: authUser.user.provider,
    });

    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${legacyToken}`)
      .expect(200);
  });
});
