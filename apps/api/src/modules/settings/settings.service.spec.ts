import { SettingsService } from './services/settings.service';

describe('SettingsService', () => {
  it('returns the settings overview sections', () => {
    const service = new SettingsService();

    expect(service.getOverview()).toEqual({
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
