import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { SettingsModule } from '@/modules/settings/settings.module';

describe('Settings API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SettingsModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the settings overview', async () => {
    await request(app.getHttpServer())
      .get('/api/settings')
      .expect(200)
      .expect({
        module: 'settings',
        status: 'available',
        sections: [
          {
            id: 'account',
            label: 'Account',
            description: 'Account preferences placeholder.',
          },
          {
            id: 'preferences',
            label: 'Preferences',
            description: 'Interface options placeholder.',
          },
          {
            id: 'system',
            label: 'System',
            description: 'Template options placeholder.',
          },
        ],
      });
  });
});
