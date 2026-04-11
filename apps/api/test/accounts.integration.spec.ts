import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/prisma/prisma.service';
import {
  AuthenticatedTestUser,
  createAuthenticatedTestUser,
} from './helpers/auth.helper';
import { resetDatabase } from './helpers/database.helper';
import { createIntegrationTestApp } from './helpers/test-app.helper';

describe('Accounts integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authUser: AuthenticatedTestUser;

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
    authUser = await createAuthenticatedTestUser(app, prisma);
  });

  it('executes account CRUD flow', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/accounts')
      .set(authUser.authHeader)
      .send({
        name: 'Conta Principal',
        type: 'checking',
        currency: 'BRL',
        openingBalanceCents: 120000,
        institution: 'Banco Teste',
      })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      name: 'Conta Principal',
      type: 'checking',
      currency: 'BRL',
      openingBalanceCents: 120000,
      institution: 'Banco Teste',
      isArchived: false,
      archivedAt: null,
      userId: authUser.user.id,
    });

    const accountId = createResponse.body.id as string;

    const listResponse = await request(app.getHttpServer())
      .get('/api/accounts')
      .set(authUser.authHeader)
      .expect(200);

    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].id).toBe(accountId);

    await request(app.getHttpServer())
      .get('/api/accounts/' + accountId)
      .set(authUser.authHeader)
      .expect(200);

    const updateResponse = await request(app.getHttpServer())
      .patch('/api/accounts/' + accountId)
      .set(authUser.authHeader)
      .send({
        name: 'Conta Atualizada',
        isArchived: true,
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: accountId,
      name: 'Conta Atualizada',
      isArchived: true,
    });
    expect(updateResponse.body.archivedAt).toEqual(expect.any(String));

    await request(app.getHttpServer())
      .delete('/api/accounts/' + accountId)
      .set(authUser.authHeader)
      .expect(200, { deleted: true });

    const notFoundResponse = await request(app.getHttpServer())
      .get('/api/accounts/' + accountId)
      .set(authUser.authHeader)
      .expect(404);

    expect(notFoundResponse.body.message).toBe('Account not found');
  });

  it('returns conflict when creating duplicated account name for same user', async () => {
    const payload = {
      name: 'Conta Duplicada',
      type: 'checking',
      currency: 'BRL',
    };

    await request(app.getHttpServer())
      .post('/api/accounts')
      .set(authUser.authHeader)
      .send(payload)
      .expect(201);

    const conflictResponse = await request(app.getHttpServer())
      .post('/api/accounts')
      .set(authUser.authHeader)
      .send(payload)
      .expect(409);

    expect(conflictResponse.body.message).toBe('Unique constraint violation');
  });

  it('returns not found when updating an unknown account', async () => {
    const unknownAccountId = randomUUID();

    const response = await request(app.getHttpServer())
      .patch('/api/accounts/' + unknownAccountId)
      .set(authUser.authHeader)
      .send({
        name: 'Inexistente',
      })
      .expect(404);

    expect(response.body.message).toBe('Account not found');
  });
});
