import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateSubcategoryContract,
  SubcategoryContract,
  UpdateSubcategoryContract,
} from '@/common/contracts';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoriesRepository } from './repositories/subcategories.repository';

@Injectable()
export class SubcategoriesService {
  constructor(
    private readonly subcategoriesRepository: SubcategoriesRepository,
  ) {}

  findAll(userId: string): Promise<SubcategoryContract[]> {
    return this.subcategoriesRepository.findAll(userId);
  }

  async findOne(id: string, userId: string): Promise<SubcategoryContract> {
    const subcategory = await this.subcategoriesRepository.findById(id, userId);
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    return subcategory;
  }

  create(userId: string, input: CreateSubcategoryDto): Promise<SubcategoryContract> {
    const payload: CreateSubcategoryContract = {
      userId,
      categoryId: input.categoryId,
      name: input.name,
    };

    return this.subcategoriesRepository.create(payload);
  }

  async update(
    id: string,
    userId: string,
    input: UpdateSubcategoryDto,
  ): Promise<SubcategoryContract> {
    await this.findOne(id, userId);

    const payload: UpdateSubcategoryContract = {
      name: input.name,
      categoryId: input.categoryId,
      isArchived: input.isArchived,
    };

    return this.subcategoriesRepository.update(id, userId, payload);
  }

  async remove(id: string, userId: string): Promise<{ deleted: true }> {
    await this.findOne(id, userId);
    await this.subcategoriesRepository.delete(id, userId);

    return { deleted: true };
  }
}
