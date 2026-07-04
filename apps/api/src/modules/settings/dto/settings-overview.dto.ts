export type SettingsSectionId = 'account' | 'preferences' | 'system';

export type SettingsSectionDto = {
  id: SettingsSectionId;
  label: string;
  description: string;
};

export type SettingsOverviewDto = {
  module: 'settings';
  status: 'available';
  sections: SettingsSectionDto[];
};
