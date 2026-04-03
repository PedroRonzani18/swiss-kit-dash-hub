import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { DashboardRepository } from './repository/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getSummary(): Promise<DashboardSummaryDto> {
    const [income, expense, recentTransactionsRaw] = await Promise.all([
      this.dashboardRepository.getTotalByType(TransactionType.income),
      this.dashboardRepository.getTotalByType(TransactionType.expense),
      this.dashboardRepository.findRecentTransactions(10),
    ]);

    const totalIncomeCents = income._sum.amountCents ?? 0;
    const totalExpenseCents = expense._sum.amountCents ?? 0;

    return {
      totalIncomeCents,
      totalExpenseCents,
      balanceCents: totalIncomeCents - totalExpenseCents,
      recentTransactions: recentTransactionsRaw.map(item => ({
        id: item.id,
        amountCents: item.amountCents,
        type: item.type,
        occurredAt: item.occurredAt.toISOString(),
        note: item.note ?? undefined,
      })),
    };
  }
}
