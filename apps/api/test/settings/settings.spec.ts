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
            labelKey: 'settings.sections.account.label',
            descriptionKey: 'settings.sections.account.description',
          },
          {
            id: 'preferences',
            labelKey: 'settings.sections.preferences.label',
            descriptionKey: 'settings.sections.preferences.description',
          },
          {
            id: 'system',
            labelKey: 'settings.sections.system.label',
            descriptionKey: 'settings.sections.system.description',
          },
        ],
      });
  });
});
