import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Product } from 'generated/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../database/product.repository.port';
import { UpdateProductCommand } from './update-product.command';
import { UpdateProductResponseDto } from './update-product.response.dto';

@Injectable()
export class UpdateProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async handle(
    command: UpdateProductCommand,
  ): Promise<UpdateProductResponseDto> {
    const productOption = await this.productRepository.findOneById(command.id);

    if (productOption.isNone()) {
      throw new NotFoundException(`Product with ID ${command.id} not found`);
    }

    const existingProduct = productOption.unwrap();
    const updatedProduct = await this.productRepository.update({
      ...existingProduct,
      name: command.name ?? existingProduct.name,
      description: command.description ?? existingProduct.description,
      price: command.price ? new Decimal(command.price) : existingProduct.price,
      category: command.category ?? existingProduct.category,
      brand: command.brand ?? existingProduct.brand,
      stock: command.stock ?? existingProduct.stock,
      isActive: command.isActive ?? existingProduct.isActive,
      imageUrl: command.imageUrl ?? existingProduct.imageUrl,
      updatedAt: new Date(),
    });

    return this.mapToResponseDto(updatedProduct);
  }

  private mapToResponseDto(product: Product): UpdateProductResponseDto {
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
