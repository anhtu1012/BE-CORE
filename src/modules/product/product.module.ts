import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';

// Controllers
import { CreateProductHttpController } from './commands/create/create-product.http.controller';
import { CreateArrayProductHttpController } from './commands/create-array/create-array-product.http.controller';
import { UpdateProductHttpController } from './commands/update/update-product.http.controller';
import { DeleteProductHttpController } from './commands/delete/delete-product.http.controller';
import { FindProductHttpController } from './queries/find-product/find-product.http.controller';
import { FindProductsHttpController } from './queries/find-products/find-products.http.controller';

// Services
import { CreateProductService } from './commands/create/create-product.service';
import { CreateArrayProductService } from './commands/create-array/create-array-product.service';
import { UpdateProductService } from './commands/update/update-product.service';
import { DeleteProductService } from './commands/delete/delete-product.service';
import { FindProductQueryHandler } from './queries/find-product/find-product.query-handler';
import { FindProductsQueryHandler } from './queries/find-products/find-products.query-handler';

// Repository
import { ProductRepositoryPrisma } from './database/product.repository.prisma';
import { PRODUCT_REPOSITORY } from './database/product.repository.port';

@Module({
  controllers: [
    CreateProductHttpController,
    CreateArrayProductHttpController,
    UpdateProductHttpController,
    DeleteProductHttpController,
    FindProductHttpController,
    FindProductsHttpController,
  ],
  providers: [
    CreateProductService,
    CreateArrayProductService,
    UpdateProductService,
    DeleteProductService,
    FindProductQueryHandler,
    FindProductsQueryHandler,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryPrisma,
    },
    PrismaService,
  ],
  exports: [
    CreateProductService,
    CreateArrayProductService,
    UpdateProductService,
    DeleteProductService,
    FindProductQueryHandler,
    FindProductsQueryHandler,
    PRODUCT_REPOSITORY,
  ],
})
export class ProductModule {}
