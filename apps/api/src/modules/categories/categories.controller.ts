import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query('userId') userId?: string) {
    return this.categoriesService.findAll(userId);
  }

  @Get(':id')
  @ApiQuery({ name: 'userId', required: false })
  findOne(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.categoriesService.findOne(id, userId);
  }

  @Post()
  create(@Body() input: CreateCategoryDto) {
    return this.categoriesService.create(input);
  }

  @Patch(':id')
  @ApiQuery({ name: 'userId', required: false })
  update(
    @Param('id') id: string,
    @Body() input: UpdateCategoryDto,
    @Query('userId') userId?: string,
  ) {
    return this.categoriesService.update(id, input, userId);
  }

  @Delete(':id')
  @ApiQuery({ name: 'userId', required: false })
  remove(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.categoriesService.remove(id, userId);
  }
}
