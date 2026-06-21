import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CategoryContract,
  CreateCategoryContract,
  UpdateCategoryContract,
} from '@/modules/finance/contracts';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  findAll(userId: string): Promise<CategoryContract[]> {
    return this.categoriesRepository.findAll(userId);
  }

  async findOne(id: string, userId: string): Promise<CategoryContract> {
    const category = await this.categoriesRepository.findById(id, userId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  create(userId: string, input: CreateCategoryDto): Promise<CategoryContract> {
    const payload: CreateCategoryContract = {
      userId,
      name: input.name,
      type: input.type as CreateCategoryContract['type'],
    };

    return this.categoriesRepository.create(payload);
  }

  async update(
    id: string,
    userId: string,
    input: UpdateCategoryDto,
  ): Promise<CategoryContract> {
    await this.findOne(id, userId);

    const payload: UpdateCategoryContract = {
      name: input.name,
      type: input.type as UpdateCategoryContract['type'],
      isArchived: input.isArchived,
    };

    return this.categoriesRepository.update(id, userId, payload);
  }

  async remove(id: string, userId: string): Promise<{ deleted: true }> {
    await this.findOne(id, userId);
    await this.categoriesRepository.delete(id, userId);

    return { deleted: true };
  }
}
