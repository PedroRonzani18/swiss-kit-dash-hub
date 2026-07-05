import { Injectable } from '@nestjs/common';
import type {
  SettingsOverviewDto,
  SettingsSectionDto,
} from '../dto/settings-overview.dto';

const SETTINGS_SECTIONS: SettingsSectionDto[] = [
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
