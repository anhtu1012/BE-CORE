import { Inject, Injectable } from '@nestjs/common';
import { Product } from 'generated/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { Result, Ok, Err } from 'oxide.ts';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../database/product.repository.port';
import { CreateProductWithImageCommand } from './create-product-with-image.command';
import { CreateProductResponseDto } from '../create/create-product.response.dto';
import { FileUploadService } from '@src/modules/file-upload/file-upload.service';

@Injectable()
export class CreateProductWithImageService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async handle(
    command: CreateProductWithImageCommand,
  ): Promise<Result<CreateProductResponseDto, Error>> {
    try {
      let imageKey: string | null = null;

      // Handle image upload if an image is provided
      if (command.image) {
        const imageUploadResult = await this.fileUploadService.uploadFile(
          command.image,
          'products',
        );

        if (imageUploadResult.isErr()) {
          return Err(new Error('Failed to upload product image'));
        }

        // Store only the object name
        imageKey = imageUploadResult.unwrap().objectName;
      }

      // Create the product with image key
      const product = await this.productRepository.insert({
        name: command.name,
        description: command.description ?? null,
        price: new Decimal(command.price),
        category: command.category,
        brand: command.brand,
        stock: command.stock ?? 0,
        isActive: command.isActive ?? true,
        imageUrl: imageKey, // Store only the object key
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product);

      // Transform to response DTO, fetching URLs as needed
      return Ok(await this.mapToResponseDto(product));
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private async mapToResponseDto(
    product: Product,
  ): Promise<CreateProductResponseDto> {
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
