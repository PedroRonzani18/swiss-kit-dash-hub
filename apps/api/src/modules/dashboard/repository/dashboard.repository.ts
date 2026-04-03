import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  getTotalByType(type: TransactionType) {
    return this.prisma.transaction.aggregate({
      where: { type },
      _sum: {
        amountCents: true,
      },
    });
  }

  findRecentTransactions(limit = 10) {
    return this.prisma.transaction.findMany({
      select: {
        id: true,
        amountCents: true,
        type: true,
        occurredAt: true,
        note: true,
      },
      orderBy: { occurredAt: 'desc' },
      take: limit,
    });
  }
}
