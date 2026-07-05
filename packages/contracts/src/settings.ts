import { z } from 'zod';

export const SettingsSectionIdSchema = z.enum(['account', 'preferences', 'system']);

export const SettingsSectionSchema = z.object({
  id: SettingsSectionIdSchema,
  labelKey: z.string().min(1),
  descriptionKey: z.string().min(1),
});

export const SettingsOverviewSchema = z.object({
  module: z.literal('settings'),
  status: z.literal('available'),
  sections: z.array(SettingsSectionSchema),
});

export type SettingsSectionId = z.infer<typeof SettingsSectionIdSchema>;
export type SettingsSectionContract = z.infer<typeof SettingsSectionSchema>;
export type SettingsOverviewContract = z.infer<typeof SettingsOverviewSchema>;

export const SETTINGS_SECTION_IDS = SettingsSectionIdSchema.options;
