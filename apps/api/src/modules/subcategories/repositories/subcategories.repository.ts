import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateSubcategoryContract,
  SubcategoryContract,
  UpdateSubcategoryContract,
} from '@/common/contracts';

const subcategorySelect = {
  id: true,
  userId: true,
  categoryId: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SubcategorySelect;

type SubcategoryRow = Prisma.SubcategoryGetPayload<{
  select: typeof subcategorySelect;
}>;

function toSubcategoryContract(row: SubcategoryRow): SubcategoryContract {
  return {
    id: row.id,
    userId: row.userId,
    categoryId: row.categoryId,
    name: row.name,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class SubcategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: string): Promise<SubcategoryContract[]> {
    const records = await this.prisma.subcategory.findMany({
      select: subcategorySelect,
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return records.map(toSubcategoryContract);
  }

  async findById(
    id: string,
    userId?: string,
  ): Promise<SubcategoryContract | null> {
    const record = await this.prisma.subcategory.findFirst({
      select: subcategorySelect,
      where: userId ? { id, userId } : { id },
    });

    return record ? toSubcategoryContract(record) : null;
  }

  async create(input: CreateSubcategoryContract): Promise<SubcategoryContract> {
    const record = await this.prisma.subcategory.create({
      select: subcategorySelect,
      data: {
        user: { connect: { id: input.userId } },
        category: { connect: { id: input.categoryId } },
        name: input.name,
      },
    });

    return toSubcategoryContract(record);
  }

  async update(
    id: string,
    input: UpdateSubcategoryContract,
  ): Promise<SubcategoryContract> {
    const record = await this.prisma.subcategory.update({
      select: subcategorySelect,
      where: { id },
      data: {
        name: input.name,
        category: input.categoryId
          ? {
              connect: { id: input.categoryId },
            }
          : undefined,
      },
    });

    return toSubcategoryContract(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subcategory.delete({ where: { id } });
  }
}
