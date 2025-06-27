import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/config/app.routes';
import { FindProductsQuery } from './find-products.query';
import { FindProductsQueryHandler } from './find-products.query-handler';
import { FindProductsResponseDto } from './find-products.response.dto';
import { resourcesV1 } from '@src/config/app.permission';

@ApiTags(`${resourcesV1.PRODUCT.parent} - ${resourcesV1.PRODUCT.name}`)
@Controller(routesV1.product.root)
export class FindProductsHttpController {
  constructor(private readonly queryHandler: FindProductsQueryHandler) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products with optional quick search',
  })
  @ApiQuery({
    name: 'quickSearch',
    required: false,
    description: 'Quick search term for products',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of items to skip',
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: FindProductsResponseDto,
  })
  async findAll(
    @Query('quickSearch') quickSearch?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<FindProductsResponseDto> {
    const query = new FindProductsQuery({
      where: {},
      skip: offset,
      take: limit,
      orderBy: [],
      quickSearch: quickSearch || undefined,
    });
    return this.queryHandler.handle(query);
  }
}
