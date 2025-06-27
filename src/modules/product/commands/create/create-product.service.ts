import { Injectable, Inject } from '@nestjs/common';
import { Product } from 'generated/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../database/product.repository.port';
import { CreateProductCommand } from './create-product.command';
import { CreateProductResponseDto } from './create-product.response.dto';

@Injectable()
export class CreateProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async handle(
    command: CreateProductCommand,
  ): Promise<CreateProductResponseDto> {
    const product = await this.productRepository.insert({
      name: command.name,
      description: command.description ?? null,
      price: new Decimal(command.price),
      category: command.category,
      brand: command.brand,
      stock: command.stock ?? 0,
      isActive: command.isActive ?? true,
      imageUrl: command.imageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product);

    return this.mapToResponseDto(product);
  }

  private mapToResponseDto(product: Product): CreateProductResponseDto {
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
