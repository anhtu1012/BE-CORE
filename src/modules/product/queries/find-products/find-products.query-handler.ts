import { Injectable, Inject } from '@nestjs/common';
import { Product } from 'generated/prisma';
import { IField } from '@src/lib/utils';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY,
} from '../../database/product.repository.port';
import { FindProductsQuery } from './find-products.query';
import {
  FindProductsResponseDto,
  FindProductsItemResponseDto,
} from './find-products.response.dto';

@Injectable()
export class FindProductsQueryHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async handle(query: FindProductsQuery): Promise<FindProductsResponseDto> {
    const searchableFields: IField[] = [
      { field: 'name', type: 'string' },
      { field: 'description', type: 'string' },
      { field: 'category', type: 'string' },
      { field: 'brand', type: 'string' },
    ];

    const result = await this.productRepository.findAllPaginatedWithQuickSearch(
      {
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
      },
    );

    return {
      count: result.count,
      limit: result.limit,
      page: result.page,
      data: result.data.map((product) => this.mapToResponseDto(product)),
    };
  }

  private mapToResponseDto(product: Product): FindProductsItemResponseDto {
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
