import type { AllowedEmailContract } from '@swisskit/contracts/allowed-emails';

type AccessListEntryPersistence = {
  id: string;
  email: string;
  isActive: boolean;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapAccessListEntryFromPersistence(
  entry: AccessListEntryPersistence,
): AllowedEmailContract {
  return {
    id: entry.id,
    email: entry.email,
    isActive: entry.isActive,
    note: entry.note,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}
