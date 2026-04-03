import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CategoryContract,
  CreateCategoryContract,
  UpdateCategoryContract,
} from '@/common/contracts';

const categorySelect = {
  id: true,
  userId: true,
  name: true,
  type: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CategorySelect;

type CategoryRow = Prisma.CategoryGetPayload<{ select: typeof categorySelect }>;

function toCategoryContract(row: CategoryRow): CategoryContract {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    type: row.type,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: string): Promise<CategoryContract[]> {
    const records = await this.prisma.category.findMany({
      select: categorySelect,
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return records.map(toCategoryContract);
  }

  async findById(id: string, userId?: string): Promise<CategoryContract | null> {
    const record = await this.prisma.category.findFirst({
      select: categorySelect,
      where: userId ? { id, userId } : { id },
    });

    return record ? toCategoryContract(record) : null;
  }

  async create(input: CreateCategoryContract): Promise<CategoryContract> {
    const record = await this.prisma.category.create({
      select: categorySelect,
      data: {
        user: { connect: { id: input.userId } },
        name: input.name,
        type: input.type,
      },
    });

    return toCategoryContract(record);
  }

  async update(id: string, input: UpdateCategoryContract): Promise<CategoryContract> {
    const record = await this.prisma.category.update({
      select: categorySelect,
      where: { id },
      data: {
        name: input.name,
        type: input.type,
      },
    });

    return toCategoryContract(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
