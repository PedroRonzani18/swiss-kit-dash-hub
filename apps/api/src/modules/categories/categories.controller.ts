import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUserContract } from '@/common/contracts';
import { CurrentUser } from '@/common/auth';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUserContract) {
    return this.categoriesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUserContract) {
    return this.categoriesService.findOne(id, user.id);
  }

  @Post()
  create(
    @Body() input: CreateCategoryDto,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.categoriesService.create(user.id, input);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() input: UpdateCategoryDto,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.categoriesService.update(id, user.id, input);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUserContract) {
    return this.categoriesService.remove(id, user.id);
  }
}
