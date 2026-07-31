import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { CATEGORY_REPOSITORY } from './constants/categories.constants';
import { PrismaCategoryRepository } from './repositories/category.repository';
import { CategoriesService } from './services/categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: CATEGORY_REPOSITORY, useClass: PrismaCategoryRepository },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
