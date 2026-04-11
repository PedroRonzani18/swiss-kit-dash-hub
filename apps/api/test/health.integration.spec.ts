import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createIntegrationTestApp } from './helpers/test-app.helper';

describe('Health integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testApp = await createIntegrationTestApp();
    app = testApp.app;
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns liveness on GET /api/health/live', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health/live')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ok',
    });
    expect(typeof response.body.timestamp).toBe('string');
    expect(typeof response.body.uptime).toBe('number');
  });

  it('returns readiness on GET /api/health/ready', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health/ready')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ready',
      checks: {
        database: 'up',
      },
    });
  });
});
