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

describe('Transactions integration', () => {
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

  async function createAccount(): Promise<{ id: string }> {
    const response = await request(app.getHttpServer())
      .post('/api/accounts')
      .set(authUser.authHeader)
      .send({
        name: 'Conta Transacoes',
        type: 'checking',
        currency: 'BRL',
      })
      .expect(201);

    return { id: response.body.id as string };
  }

  async function createCategory(input?: { name?: string }): Promise<{
    id: string;
  }> {
    const response = await request(app.getHttpServer())
      .post('/api/categories')
      .set(authUser.authHeader)
      .send({
        name: input?.name ?? 'Transporte',
        type: 'expense',
      })
      .expect(201);

    return { id: response.body.id as string };
  }

  async function createSubcategory(categoryId: string): Promise<{ id: string }> {
    const response = await request(app.getHttpServer())
      .post('/api/subcategories')
      .set(authUser.authHeader)
      .send({
        categoryId,
        name: 'Combustivel',
      })
      .expect(201);

    return { id: response.body.id as string };
  }

  it('executes transaction CRUD flow', async () => {
    const account = await createAccount();
    const category = await createCategory();
    const subcategory = await createSubcategory(category.id);
    const occurredAt = '2026-04-03T10:00:00.000Z';

    const createResponse = await request(app.getHttpServer())
      .post('/api/transactions')
      .set(authUser.authHeader)
      .send({
        type: 'expense',
        amountCents: 2590,
        accountId: account.id,
        categoryId: category.id,
        subcategoryId: subcategory.id,
        occurredAt,
        note: 'Abastecimento',
      })
      .expect(201);

    const transactionId = createResponse.body.id as string;
    expect(createResponse.body).toMatchObject({
      id: transactionId,
      userId: authUser.user.id,
      type: 'expense',
      amountCents: 2590,
      accountId: account.id,
      categoryId: category.id,
      subcategoryId: subcategory.id,
      occurredAt,
      note: 'Abastecimento',
    });

    const listResponse = await request(app.getHttpServer())
      .get('/api/transactions')
      .set(authUser.authHeader)
      .expect(200);

    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].id).toBe(transactionId);

    await request(app.getHttpServer())
      .get('/api/transactions/' + transactionId)
      .set(authUser.authHeader)
      .expect(200);

    const updatedOccurredAt = '2026-04-03T12:00:00.000Z';
    const updateResponse = await request(app.getHttpServer())
      .patch('/api/transactions/' + transactionId)
      .set(authUser.authHeader)
      .send({
        amountCents: 3199,
        subcategoryId: null,
        note: null,
        occurredAt: updatedOccurredAt,
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: transactionId,
      amountCents: 3199,
      subcategoryId: null,
      note: null,
      occurredAt: updatedOccurredAt,
    });

    await request(app.getHttpServer())
      .delete('/api/transactions/' + transactionId)
      .set(authUser.authHeader)
      .expect(200, { deleted: true });

    const notFoundResponse = await request(app.getHttpServer())
      .get('/api/transactions/' + transactionId)
      .set(authUser.authHeader)
      .expect(404);

    expect(notFoundResponse.body.message).toBe('Transaction not found');
  });

  it('returns not found when account relation does not exist for user', async () => {
    const category = await createCategory();

    const response = await request(app.getHttpServer())
      .post('/api/transactions')
      .set(authUser.authHeader)
      .send({
        type: 'expense',
        amountCents: 1000,
        accountId: randomUUID(),
        categoryId: category.id,
        occurredAt: '2026-04-03T12:00:00.000Z',
      })
      .expect(404);

    expect(response.body.message).toBe('Account not found for authenticated user');
  });

  it('prevents category updates that would keep an invalid subcategory relation', async () => {
    const account = await createAccount();
    const firstCategory = await createCategory({ name: 'Casa' });
    const secondCategory = await createCategory({ name: 'Saude' });
    const subcategory = await createSubcategory(firstCategory.id);

    const transactionResponse = await request(app.getHttpServer())
      .post('/api/transactions')
      .set(authUser.authHeader)
      .send({
        type: 'expense',
        amountCents: 2000,
        accountId: account.id,
        categoryId: firstCategory.id,
        subcategoryId: subcategory.id,
        occurredAt: '2026-04-04T09:00:00.000Z',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .patch('/api/transactions/' + transactionResponse.body.id)
      .set(authUser.authHeader)
      .send({
        categoryId: secondCategory.id,
      })
      .expect(404);

    expect(response.body.message).toBe(
      'Subcategory not found for authenticated user and category',
    );
  });

  it('creates installments with monthly rollover and last-day clamp', async () => {
    const account = await createAccount();
    const category = await createCategory();

    const bulkResponse = await request(app.getHttpServer())
      .post('/api/transactions/bulk')
      .set(authUser.authHeader)
      .send({
        items: [
          {
            type: 'expense',
            amountCents: 1000,
            accountId: account.id,
            categoryId: category.id,
            occurredAt: '2026-01-31T12:00:00.000Z',
            note: 'Compra parcelada',
            installmentEnabled: true,
            installmentCount: 3,
          },
        ],
      })
      .expect(201);

    expect(bulkResponse.body).toEqual({ count: 3 });

    const listResponse = await request(app.getHttpServer())
      .get('/api/transactions')
      .set(authUser.authHeader)
      .expect(200);

    expect(listResponse.body).toHaveLength(3);

    const installments = [...listResponse.body].sort(
      (a, b) => a.installmentNumber - b.installmentNumber,
    );

    expect(installments[0]).toMatchObject({
      note: 'Compra parcelada (1/3)',
      isInstallment: true,
      installmentNumber: 1,
      installmentTotal: 3,
      occurredAt: '2026-01-31T12:00:00.000Z',
    });
    expect(installments[1]).toMatchObject({
      note: 'Compra parcelada (2/3)',
      isInstallment: true,
      installmentNumber: 2,
      installmentTotal: 3,
      occurredAt: '2026-02-28T12:00:00.000Z',
    });
    expect(installments[2]).toMatchObject({
      note: 'Compra parcelada (3/3)',
      isInstallment: true,
      installmentNumber: 3,
      installmentTotal: 3,
      occurredAt: '2026-03-31T12:00:00.000Z',
    });

    const groupIds = new Set(
      installments.map((transaction) => transaction.installmentGroupId),
    );
    expect(groupIds.size).toBe(1);
    expect(installments.reduce((sum, tx) => sum + tx.amountCents, 0)).toBe(1000);
  });
});
