import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AccessListController } from '../controllers/access-list.controller';
import { AccessListService } from '../services/access-list.service';

describe('AccessListController', () => {
  let app: INestApplication;

  const entry = {
    id: '1e354247-1055-4c67-850d-bd3614bc424d',
    email: 'user@example.com',
    isActive: false,
    note: null,
    createdAt: '2026-07-04T21:00:00.000Z',
    updatedAt: '2026-07-04T23:21:23.107Z',
  };
  const accessListService = {
    updateEntryStatus: jest.fn().mockResolvedValue(entry),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AccessListController],
      providers: [
        {
          provide: AccessListService,
          useValue: accessListService,
        },
      ],
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

  afterAll(async () => {
    await app.close();
  });

  it('accepts isActive when updating an entry status', async () => {
    await request(app.getHttpServer())
      .patch(`/api/allowed-emails/${entry.id}/status`)
      .send({ isActive: false })
      .expect(200)
      .expect(entry);

    expect(accessListService.updateEntryStatus).toHaveBeenCalledWith(entry.id, {
      isActive: false,
    });
  });

  it('rejects a non-boolean status', async () => {
    await request(app.getHttpServer())
      .patch(`/api/allowed-emails/${entry.id}/status`)
      .send({ isActive: 'false' })
      .expect(400);
  });
});
