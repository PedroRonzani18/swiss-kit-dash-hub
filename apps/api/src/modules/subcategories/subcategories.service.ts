import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoriesRepository } from './repository/subcategories.repository';

@Injectable()
export class SubcategoriesService {
  constructor(
    private readonly subcategoriesRepository: SubcategoriesRepository,
  ) {}

  findAll() {
    return this.subcategoriesRepository.findAll();
  }

  async findOne(id: string) {
    const subcategory = await this.subcategoriesRepository.findById(id);
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    return subcategory;
  }

  create(input: CreateSubcategoryDto) {
    return this.subcategoriesRepository.create({
      name: input.name,
      category: {
        connect: {
          id: input.categoryId,
        },
      },
    });
  }

  async update(id: string, input: UpdateSubcategoryDto) {
    await this.findOne(id);

    return this.subcategoriesRepository.update(id, {
      name: input.name,
      category: input.categoryId
        ? {
            connect: {
              id: input.categoryId,
            },
          }
        : undefined,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.subcategoriesRepository.delete(id);

    return { deleted: true };
  }
}
