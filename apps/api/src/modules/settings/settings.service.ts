import { Injectable } from '@nestjs/common';
import type { SettingsOverview, SettingsSection } from './settings.types';

const SETTINGS_SECTIONS: SettingsSection[] = [
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
];

@Injectable()
export class SettingsService {
  getOverview(): SettingsOverview {
    return {
      module: 'settings',
      status: 'available',
      sections: SETTINGS_SECTIONS,
    };
  }
}
