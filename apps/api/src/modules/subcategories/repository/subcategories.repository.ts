import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubcategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.subcategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.subcategory.findUnique({ where: { id } });
  }

  create(data: Prisma.SubcategoryCreateInput) {
    return this.prisma.subcategory.create({ data });
  }

  update(id: string, data: Prisma.SubcategoryUpdateInput) {
    return this.prisma.subcategory.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.subcategory.delete({ where: { id } });
  }
}
