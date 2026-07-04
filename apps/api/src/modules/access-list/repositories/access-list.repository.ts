import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { AllowedEmailContract } from '@swisskit/contracts/allowed-emails';
import { mapAccessListEntryFromPersistence } from '../mappers/access-list.mapper';

@Injectable()
export class AccessListRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listEntries(): Promise<AllowedEmailContract[]> {
    const records = await this.prisma.allowedEmail.findMany({
      select: {
        id: true,
        email: true,
        isActive: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(mapAccessListEntryFromPersistence);
  }
}
