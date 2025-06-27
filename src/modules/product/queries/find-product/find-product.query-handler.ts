import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../database/product.repository.port';
import { ProductResponseDto } from '../../dto/product.dto';
import { FindProductQuery } from './find-product.query';
import { Product } from 'generated/prisma';

@Injectable()
export class FindProductQueryHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async handle(query: FindProductQuery): Promise<ProductResponseDto> {
    const productOption = await this.productRepository.findOneById(query.id);

    if (productOption.isNone()) {
      throw new NotFoundException(`Product with ID ${query.id} not found`);
    }

    return this.mapToResponseDto(productOption.unwrap());
  }

  private mapToResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description ?? undefined,
      price: parseFloat(product.price.toString()),
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      isActive: product.isActive,
      imageUrl: product.imageUrl ?? undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
