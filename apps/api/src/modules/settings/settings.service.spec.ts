import { SettingsService } from './settings.service';

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
          description: 'Reserved area for account preferences.',
        },
        {
          id: 'preferences',
          label: 'Preferences',
          description: 'Reserved area for interface options.',
        },
        {
          id: 'system',
          label: 'System',
          description: 'Reserved area for template options.',
        },
      ],
    });
  });
});
