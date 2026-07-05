import { SETTINGS_SECTION_IDS } from '@swisskit/contracts/settings';
import type {
  SettingsOverviewContract,
  SettingsSectionContract,
  SettingsSectionId,
} from '@swisskit/contracts/settings';
import { ApiProperty } from '@nestjs/swagger';

export class SettingsSectionDto implements SettingsSectionContract {
  @ApiProperty({
    enum: SETTINGS_SECTION_IDS,
    example: 'account',
    description: 'Stable settings section identifier.',
  })
  id!: SettingsSectionId;

  @ApiProperty({
    example: 'settings.sections.account.label',
    description: 'Stable frontend translation key for the section label.',
  })
  labelKey!: string;

  @ApiProperty({
    example: 'settings.sections.account.description',
    description: 'Stable frontend translation key for the section description.',
  })
  descriptionKey!: string;
}

export class SettingsOverviewDto implements SettingsOverviewContract {
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
