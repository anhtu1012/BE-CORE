import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { AuthModule } from '@src/shared/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from '@src/modules/file-upload/file-upload.module';

// Controllers
import { CreateProductHttpController } from './commands/create/create-product.http.controller';
import { CreateArrayProductHttpController } from './commands/create-array/create-array-product.http.controller';
import { UpdateProductHttpController } from './commands/update/update-product.http.controller';
import { DeleteProductHttpController } from './commands/delete/delete-product.http.controller';
import { FindProductHttpController } from './queries/find-product/find-product.http.controller';
import { FindProductsHttpController } from './queries/find-products/find-products.http.controller';
import { CreateProductWithImageHttpController } from './commands/create-with-image/create-product-with-image.http.controller';
import { UpdateProductWithImageHttpController } from './commands/update-with-image/update-product-with-image.http.controller';

// Services
import { CreateProductService } from './commands/create/create-product.service';
import { CreateArrayProductService } from './commands/create-array/create-array-product.service';
import { UpdateProductService } from './commands/update/update-product.service';
import { DeleteProductService } from './commands/delete/delete-product.service';
import { FindProductQueryHandler } from './queries/find-product/find-product.query-handler';
import { FindProductsQueryHandler } from './queries/find-products/find-products.query-handler';
import { CreateProductWithImageService } from './commands/create-with-image/create-product-with-image.service';
import { UpdateProductWithImageService } from './commands/update-with-image/update-product-with-image.service';

// Repository
import { ProductRepositoryPrisma } from './database/product.repository.prisma';
import { PRODUCT_REPOSITORY } from './database/product.repository.port';

@Module({
  imports: [AuthModule, ConfigModule, FileUploadModule],
  controllers: [
    CreateProductHttpController,
    CreateArrayProductHttpController,
    UpdateProductHttpController,
    DeleteProductHttpController,
    FindProductHttpController,
    FindProductsHttpController,
    CreateProductWithImageHttpController,
    UpdateProductWithImageHttpController,
  ],
  providers: [
    CreateProductService,
    CreateArrayProductService,
    UpdateProductService,
    DeleteProductService,
    FindProductQueryHandler,
    FindProductsQueryHandler,
    CreateProductWithImageService,
    UpdateProductWithImageService,
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
    CreateProductWithImageService,
    UpdateProductWithImageService,
    PRODUCT_REPOSITORY,
  ],
})
export class ProductModule {}
