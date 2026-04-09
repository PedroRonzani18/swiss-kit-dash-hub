import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CategoryContract,
  CreateCategoryContract,
  UpdateCategoryContract,
} from '@/common/contracts';
import { mapCategoryFromPersistence } from '@/common/mappers';

const categorySelect = {
  id: true,
  userId: true,
  name: true,
  type: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CategorySelect;

type CategoryRow = Prisma.CategoryGetPayload<{ select: typeof categorySelect }>;

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<CategoryContract[]> {
    const records = await this.prisma.category.findMany({
      select: categorySelect,
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) =>
      mapCategoryFromPersistence(record as CategoryRow),
    );
  }

  async findById(id: string, userId: string): Promise<CategoryContract | null> {
    const record = await this.prisma.category.findUnique({
      select: categorySelect,
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });

    return record ? mapCategoryFromPersistence(record as CategoryRow) : null;
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

    return mapCategoryFromPersistence(record as CategoryRow);
  }

  async update(
    id: string,
    userId: string,
    input: UpdateCategoryContract,
  ): Promise<CategoryContract> {
    const record = await this.prisma.category.update({
      select: categorySelect,
      where: {
        id_userId: {
          id,
          userId,
        },
      },
      data: {
        name: input.name,
        type: input.type,
        isArchived: input.isArchived,
      },
    });

    return mapCategoryFromPersistence(record as CategoryRow);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.transaction.deleteMany({
        where: {
          userId,
          categoryId: id,
        },
      }),
      this.prisma.category.delete({
        where: {
          id_userId: {
            id,
            userId,
          },
        },
      }),
    ]);
  }
}
