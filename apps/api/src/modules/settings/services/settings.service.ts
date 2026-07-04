import { Injectable } from '@nestjs/common';
import type {
  SettingsOverviewDto,
  SettingsSectionDto,
} from '../dto/settings-overview.dto';

const SETTINGS_SECTIONS: SettingsSectionDto[] = [
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
];

@Injectable()
export class SettingsService {
  getOverview(): SettingsOverviewDto {
    return {
      module: 'settings',
      status: 'available',
      sections: SETTINGS_SECTIONS,
    };
  }
}
