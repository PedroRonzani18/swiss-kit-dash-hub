import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './repository/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  findAll() {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  create(input: CreateCategoryDto) {
    return this.categoriesRepository.create({
      name: input.name,
      type: input.type,
    });
  }

  async update(id: string, input: UpdateCategoryDto) {
    await this.findOne(id);

    return this.categoriesRepository.update(id, {
      name: input.name,
      type: input.type,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.categoriesRepository.delete(id);

    return { deleted: true };
  }
}
