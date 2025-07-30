import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Result, Ok, Err } from 'oxide.ts';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../database/product.repository.port';
import { ProductResponseDto } from '../../dto/product.dto';
import { FindProductQuery } from './find-product.query';
import { Product } from 'generated/prisma';
import { FileUploadService } from '@src/modules/file-upload/file-upload.service';

@Injectable()
export class FindProductQueryHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async handle(
    query: FindProductQuery,
  ): Promise<Result<ProductResponseDto, Error>> {
    try {
      const productOption = await this.productRepository.findOneById(query.id);

      if (productOption.isNone()) {
        return Err(
          new NotFoundException(`Product with ID ${query.id} not found`),
        );
      }

      return Ok(await this.mapToResponseDto(productOption.unwrap()));
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private async mapToResponseDto(
    product: Product,
  ): Promise<ProductResponseDto> {
    // Get URL for imageUrl if it exists
    let imageUrl: string | undefined = undefined;
    if (product.imageUrl) {
      const urlResult = await this.fileUploadService.getFileUrl(
        product.imageUrl,
      );
      if (urlResult.isOk()) {
        imageUrl = urlResult.unwrap();
      }
    }

    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description ?? undefined,
      price: parseFloat(product.price.toString()),
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      isActive: product.isActive,
      imageUrl,
      imageKey: product.imageUrl ?? undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
