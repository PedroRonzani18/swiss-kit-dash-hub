import { Module } from '@nestjs/common';
import { SubcategoriesController } from './subcategories.controller';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesRepository } from './repository/subcategories.repository';

@Module({
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService, SubcategoriesRepository],
  exports: [SubcategoriesService],
})
export class SubcategoriesModule {}
