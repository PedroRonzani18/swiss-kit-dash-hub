import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  create(data: Prisma.AccountCreateInput) {
    return this.prisma.account.create({ data });
  }

  update(id: string, data: Prisma.AccountUpdateInput) {
    return this.prisma.account.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.account.delete({ where: { id } });
  }
}
