export type SettingsSectionId = 'account' | 'preferences' | 'system';

export type SettingsSection = {
  id: SettingsSectionId;
  label: string;
  description: string;
};

export type SettingsOverview = {
  module: 'settings';
  status: 'available';
  sections: SettingsSection[];
};
