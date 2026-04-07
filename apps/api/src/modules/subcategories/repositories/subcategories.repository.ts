import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateSubcategoryContract,
  SubcategoryContract,
  UpdateSubcategoryContract,
} from '@/common/contracts';
import { mapSubcategoryFromPersistence } from '@/common/mappers';

const subcategorySelect = {
  id: true,
  userId: true,
  categoryId: true,
  name: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SubcategorySelect;

type SubcategoryRow = Prisma.SubcategoryGetPayload<{
  select: typeof subcategorySelect;
}>;

@Injectable()
export class SubcategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<SubcategoryContract[]> {
    const records = await this.prisma.subcategory.findMany({
      select: subcategorySelect,
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) =>
      mapSubcategoryFromPersistence(record as SubcategoryRow),
    );
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<SubcategoryContract | null> {
    const record = await this.prisma.subcategory.findUnique({
      select: subcategorySelect,
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });

    return record
      ? mapSubcategoryFromPersistence(record as SubcategoryRow)
      : null;
  }

  async create(input: CreateSubcategoryContract): Promise<SubcategoryContract> {
    const record = await this.prisma.subcategory.create({
      select: subcategorySelect,
      data: {
        user: { connect: { id: input.userId } },
        category: {
          connect: {
            id_userId: {
              id: input.categoryId,
              userId: input.userId,
            },
          },
        },
        name: input.name,
      },
    });

    return mapSubcategoryFromPersistence(record as SubcategoryRow);
  }

  async update(
    id: string,
    userId: string,
    input: UpdateSubcategoryContract,
  ): Promise<SubcategoryContract> {
    const record = await this.prisma.subcategory.update({
      select: subcategorySelect,
      where: {
        id_userId: {
          id,
          userId,
        },
      },
      data: {
        name: input.name,
        isArchived: input.isArchived,
        category: input.categoryId
          ? {
              connect: {
                id_userId: {
                  id: input.categoryId,
                  userId,
                },
              },
            }
          : undefined,
      },
    });

    return mapSubcategoryFromPersistence(record as SubcategoryRow);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.transaction.deleteMany({
        where: {
          userId,
          subcategoryId: id,
        },
      }),
      this.prisma.subcategory.delete({
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
