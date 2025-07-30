import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Product } from 'generated/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { Result, Ok, Err } from 'oxide.ts';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../database/product.repository.port';
import { UpdateProductWithImageCommand } from './update-product-with-image.command';
import { UpdateProductResponseDto } from '../update/update-product.response.dto';
import { FileUploadService } from '@src/modules/file-upload/file-upload.service';

@Injectable()
export class UpdateProductWithImageService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async handle(
    command: UpdateProductWithImageCommand,
  ): Promise<Result<UpdateProductResponseDto, Error>> {
    try {
      const productOption = await this.productRepository.findOneById(
        command.id,
      );

      if (productOption.isNone()) {
        return Err(
          new NotFoundException(`Product with ID ${command.id} not found`),
        );
      }

      const existingProduct = productOption.unwrap();
      let imageKey = existingProduct.imageUrl;

      // Handle image upload if a new image is provided
      if (command.image) {
        // Delete old image if exists
        if (existingProduct.imageUrl) {
          await this.fileUploadService
            .deleteFile(existingProduct.imageUrl)
            .catch(() => {
              // Ignore errors when trying to delete old image
              console.log(
                `Failed to delete old image: ${existingProduct.imageUrl}`,
              );
            });
        }

        // Upload new image
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

      // Update the product with the new information
      const updatedProduct = await this.productRepository.update({
        ...existingProduct,
        name: command.name ?? existingProduct.name,
        description: command.description ?? existingProduct.description,
        price: command.price
          ? new Decimal(command.price)
          : existingProduct.price,
        category: command.category ?? existingProduct.category,
        brand: command.brand ?? existingProduct.brand,
        stock: command.stock ?? existingProduct.stock,
        isActive: command.isActive ?? existingProduct.isActive,
        imageUrl: imageKey, // Store only object key
        updatedAt: new Date(),
      });

      return Ok(await this.mapToResponseDto(updatedProduct));
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private async mapToResponseDto(
    product: Product,
  ): Promise<UpdateProductResponseDto> {
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
