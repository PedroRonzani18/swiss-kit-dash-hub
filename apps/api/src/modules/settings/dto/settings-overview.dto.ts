import { ApiProperty } from '@nestjs/swagger';

export const SETTINGS_SECTION_IDS = ['account', 'preferences', 'system'] as const;

export type SettingsSectionId = (typeof SETTINGS_SECTION_IDS)[number];

export class SettingsSectionDto {
  @ApiProperty({
    enum: SETTINGS_SECTION_IDS,
    example: 'account',
    description: 'Stable settings section identifier.',
  })
  id!: SettingsSectionId;

  @ApiProperty({
    example: 'Account',
    description: 'Human-readable section label.',
  })
  label!: string;

  @ApiProperty({
    example: 'Account preferences placeholder.',
    description: 'Short description of the section purpose.',
  })
  description!: string;
}

export class SettingsOverviewDto {
  @ApiProperty({
    example: 'settings',
    description: 'Template module identifier.',
  })
  module!: 'settings';

  @ApiProperty({
    example: 'available',
    description: 'Current module availability status.',
  })
  status!: 'available';

  @ApiProperty({
    type: () => [SettingsSectionDto],
    description: 'Settings sections exposed by this template module.',
  })
  sections!: SettingsSectionDto[];
}
