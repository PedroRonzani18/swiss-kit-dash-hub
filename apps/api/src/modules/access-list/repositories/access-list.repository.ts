import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type {
  AllowedEmailContract,
  CreateAllowedEmailInputContract,
  UpdateAllowedEmailStatusInputContract,
} from '@swisskit/contracts/allowed-emails';
import { mapAccessListEntryFromPersistence } from '../mappers/access-list.mapper';

const accessListSelect = {
  id: true,
  email: true,
  isActive: true,
  note: true,
  createdAt: true,
  updatedAt: true,
} as const;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeAccessListNote(note?: string | null): string | null {
  const normalizedNote = note?.trim();

  return normalizedNote ? normalizedNote : null;
}

@Injectable()
export class AccessListRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listEntries(): Promise<AllowedEmailContract[]> {
    const records = await this.prisma.allowedEmail.findMany({
      select: accessListSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(mapAccessListEntryFromPersistence);
  }

  async createOrReactivateEntry(
    input: CreateAllowedEmailInputContract,
  ): Promise<AllowedEmailContract> {
    const record = await this.prisma.allowedEmail.upsert({
      select: accessListSelect,
      where: {
        email: normalizeEmail(input.email),
      },
      update: {
        isActive: true,
        note: normalizeAccessListNote(input.note),
      },
      create: {
        email: normalizeEmail(input.email),
        isActive: true,
        note: normalizeAccessListNote(input.note),
      },
    });

    return mapAccessListEntryFromPersistence(record);
  }

  async updateEntryStatus(
    id: string,
    input: UpdateAllowedEmailStatusInputContract,
  ): Promise<AllowedEmailContract> {
    const record = await this.prisma.allowedEmail.update({
      select: accessListSelect,
      where: {
        id,
      },
      data: {
        isActive: input.isActive,
      },
    });

    return mapAccessListEntryFromPersistence(record);
  }
}
