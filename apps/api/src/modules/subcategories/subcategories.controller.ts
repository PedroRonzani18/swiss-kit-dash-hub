import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUserContract } from '@/common/contracts';
import { CurrentUser } from '@/common/auth';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@ApiTags('Subcategories')
@ApiBearerAuth('access-token')
@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUserContract) {
    return this.subcategoriesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUserContract) {
    return this.subcategoriesService.findOne(id, user.id);
  }

  @Post()
  create(
    @Body() input: CreateSubcategoryDto,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.subcategoriesService.create(user.id, input);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() input: UpdateSubcategoryDto,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.subcategoriesService.update(id, user.id, input);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUserContract) {
    return this.subcategoriesService.remove(id, user.id);
  }
}
