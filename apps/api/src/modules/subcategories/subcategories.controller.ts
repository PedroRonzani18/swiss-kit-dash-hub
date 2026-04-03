import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@ApiTags('Subcategories')
@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Get()
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query('userId') userId?: string) {
    return this.subcategoriesService.findAll(userId);
  }

  @Get(':id')
  @ApiQuery({ name: 'userId', required: false })
  findOne(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.subcategoriesService.findOne(id, userId);
  }

  @Post()
  create(@Body() input: CreateSubcategoryDto) {
    return this.subcategoriesService.create(input);
  }

  @Patch(':id')
  @ApiQuery({ name: 'userId', required: false })
  update(
    @Param('id') id: string,
    @Body() input: UpdateSubcategoryDto,
    @Query('userId') userId?: string,
  ) {
    return this.subcategoriesService.update(id, input, userId);
  }

  @Delete(':id')
  @ApiQuery({ name: 'userId', required: false })
  remove(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.subcategoriesService.remove(id, userId);
  }
}
