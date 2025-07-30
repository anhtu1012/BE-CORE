import { Injectable, Inject } from '@nestjs/common';
import { Product } from 'generated/prisma';
import { IField } from '@src/lib/utils';
import { Result, Ok, Err } from 'oxide.ts';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../database/product.repository.port';
import { FindProductsQuery } from './find-products.query';
import {
  FindProductsResponseDto,
  FindProductsItemResponseDto,
} from './find-products.response.dto';
import { FileUploadService } from '@src/modules/file-upload/file-upload.service';

@Injectable()
export class FindProductsQueryHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async handle(
    query: FindProductsQuery,
  ): Promise<Result<FindProductsResponseDto, Error>> {
    try {
      const searchableFields: IField[] = [
        { field: 'name', type: 'string' },
        { field: 'description', type: 'string' },
        { field: 'category', type: 'string' },
        { field: 'brand', type: 'string' },
      ];

      const result =
        await this.productRepository.findAllPaginatedWithQuickSearch({
          limit: query.limit,
          offset: query.offset,
          page: query.page,
          where: query.where,
          orderBy: query.orderBy,
          quickSearch: query.quickSearch
            ? {
                quickSearchString: query.quickSearch,
                searchableFields,
              }
            : undefined,
        });

      // Map all products to response DTOs and generate URLs in parallel
      const dtoPromises = result.data.map((product) =>
        this.mapToResponseDto(product),
      );
      const dtos = await Promise.all(dtoPromises);

      return Ok({
        count: result.count,
        limit: result.limit,
        page: result.page,
        data: dtos,
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private async mapToResponseDto(
    product: Product,
  ): Promise<FindProductsItemResponseDto> {
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
      imageUrl, // Now properly initialized
      imageKey: product.imageUrl ?? undefined, // Include the key
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
