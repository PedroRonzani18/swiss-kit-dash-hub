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

describe('Categories and subcategories integration', () => {
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

  it('executes category CRUD flow', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/categories')
      .set(authUser.authHeader)
      .send({
        name: 'Alimentacao',
        type: 'expense',
      })
      .expect(201);

    const categoryId = createResponse.body.id as string;
    expect(createResponse.body).toMatchObject({
      id: categoryId,
      userId: authUser.user.id,
      name: 'Alimentacao',
      type: 'expense',
      isArchived: false,
    });

    const listResponse = await request(app.getHttpServer())
      .get('/api/categories')
      .set(authUser.authHeader)
      .expect(200);

    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].id).toBe(categoryId);

    await request(app.getHttpServer())
      .get('/api/categories/' + categoryId)
      .set(authUser.authHeader)
      .expect(200);

    const updateResponse = await request(app.getHttpServer())
      .patch('/api/categories/' + categoryId)
      .set(authUser.authHeader)
      .send({
        name: 'Mercado',
        isArchived: true,
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: categoryId,
      name: 'Mercado',
      isArchived: true,
    });

    await request(app.getHttpServer())
      .delete('/api/categories/' + categoryId)
      .set(authUser.authHeader)
      .expect(200, { deleted: true });

    const notFoundResponse = await request(app.getHttpServer())
      .get('/api/categories/' + categoryId)
      .set(authUser.authHeader)
      .expect(404);

    expect(notFoundResponse.body.message).toBe('Category not found');
  });

  it('returns conflict when creating duplicated category for same user', async () => {
    const payload = {
      name: 'Transporte',
      type: 'expense',
    };

    await request(app.getHttpServer())
      .post('/api/categories')
      .set(authUser.authHeader)
      .send(payload)
      .expect(201);

    const conflictResponse = await request(app.getHttpServer())
      .post('/api/categories')
      .set(authUser.authHeader)
      .send(payload)
      .expect(409);

    expect(conflictResponse.body.message).toBe('Unique constraint violation');
  });

  it('executes subcategory CRUD flow', async () => {
    const categoryResponse = await request(app.getHttpServer())
      .post('/api/categories')
      .set(authUser.authHeader)
      .send({
        name: 'Moradia',
        type: 'expense',
      })
      .expect(201);

    const targetCategoryResponse = await request(app.getHttpServer())
      .post('/api/categories')
      .set(authUser.authHeader)
      .send({
        name: 'Lazer',
        type: 'expense',
      })
      .expect(201);

    const subcategoryResponse = await request(app.getHttpServer())
      .post('/api/subcategories')
      .set(authUser.authHeader)
      .send({
        categoryId: categoryResponse.body.id,
        name: 'Aluguel',
      })
      .expect(201);

    const subcategoryId = subcategoryResponse.body.id as string;
    expect(subcategoryResponse.body).toMatchObject({
      id: subcategoryId,
      categoryId: categoryResponse.body.id,
      name: 'Aluguel',
      isArchived: false,
      userId: authUser.user.id,
    });

    const listResponse = await request(app.getHttpServer())
      .get('/api/subcategories')
      .set(authUser.authHeader)
      .expect(200);

    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].id).toBe(subcategoryId);

    await request(app.getHttpServer())
      .get('/api/subcategories/' + subcategoryId)
      .set(authUser.authHeader)
      .expect(200);

    const updateResponse = await request(app.getHttpServer())
      .patch('/api/subcategories/' + subcategoryId)
      .set(authUser.authHeader)
      .send({
        name: 'Condominio',
        categoryId: targetCategoryResponse.body.id,
        isArchived: true,
      })
      .expect(200);

    expect(updateResponse.body).toMatchObject({
      id: subcategoryId,
      name: 'Condominio',
      categoryId: targetCategoryResponse.body.id,
      isArchived: true,
    });

    await request(app.getHttpServer())
      .delete('/api/subcategories/' + subcategoryId)
      .set(authUser.authHeader)
      .expect(200, { deleted: true });

    const notFoundResponse = await request(app.getHttpServer())
      .get('/api/subcategories/' + subcategoryId)
      .set(authUser.authHeader)
      .expect(404);

    expect(notFoundResponse.body.message).toBe('Subcategory not found');
  });

  it('returns not found when creating subcategory with unknown category', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/subcategories')
      .set(authUser.authHeader)
      .send({
        categoryId: randomUUID(),
        name: 'Invalida',
      })
      .expect(404);

    expect(response.body.message).toBe('Record not found');
  });
});
