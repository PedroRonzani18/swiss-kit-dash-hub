import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';

describe('UsersController', () => {
  let app: INestApplication;
  const user = {
    id: '1e354247-1055-4c67-850d-bd3614bc424d',
    email: 'user@example.com',
    name: null,
    avatarUrl: null,
    isActive: true,
    note: null,
    provider: null,
    lastLoginAt: null,
    createdAt: '2026-07-04T21:00:00.000Z',
    updatedAt: '2026-07-04T23:21:23.107Z',
  };
  const usersService = {
    createOrReactivate: jest.fn().mockResolvedValue(user),
    updateStatus: jest.fn().mockResolvedValue(user),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => app.close());

  it('accepts an email when provisioning a user', async () => {
    await request(app.getHttpServer())
      .post('/api/users')
      .send({ email: user.email, note: 'Onboarding' })
      .expect(201)
      .expect(user);
  });

  it('rejects a non-boolean status', async () => {
    await request(app.getHttpServer())
      .patch(`/api/users/${user.id}/status`)
      .send({ isActive: 'false' })
      .expect(400);
  });
});
