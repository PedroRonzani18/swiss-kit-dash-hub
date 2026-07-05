import { SettingsService } from '../services/settings.service';

describe('SettingsService', () => {
  it('returns the settings overview sections', () => {
    const service = new SettingsService();

    expect(service.getOverview()).toEqual({
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
