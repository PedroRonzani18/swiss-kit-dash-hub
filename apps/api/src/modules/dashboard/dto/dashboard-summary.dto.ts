import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto {
  @ApiProperty({ example: 0 })
  totalIncomeCents: number;

  @ApiProperty({ example: 0 })
  totalExpenseCents: number;

  @ApiProperty({ example: 0 })
  balanceCents: number;

  @ApiProperty({ example: [] })
  recentTransactions: {
    id: string;
    amountCents: number;
    type: string;
    occurredAt: string;
    note?: string;
  }[];
}
