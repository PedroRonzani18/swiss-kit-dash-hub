import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.transaction.findMany({
      orderBy: { occurredAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  create(data: Prisma.TransactionCreateInput) {
    return this.prisma.transaction.create({ data });
  }

  update(id: string, data: Prisma.TransactionUpdateInput) {
    return this.prisma.transaction.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
