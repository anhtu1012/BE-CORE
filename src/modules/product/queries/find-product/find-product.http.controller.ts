import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { routesV1 } from '@src/config/app.routes';
import { match } from '@src/lib/utils/result-matcher.util';
import { ProductResponseDto } from '../../dto/product.dto';
import { FindProductQuery } from './find-product.query';
import { FindProductQueryHandler } from './find-product.query-handler';
import { resourcesV1 } from '@src/config/app.permission';
import { ClerkAuthGuard } from '@src/shared/auth/guards/clerk-auth.guard';

@ApiTags(`${resourcesV1.PRODUCT.parent} - ${resourcesV1.PRODUCT.name}`)
@Controller(routesV1.product.root)
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
export class FindProductHttpController {
  constructor(private readonly queryHandler: FindProductQueryHandler) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto> {
    const query = new FindProductQuery(BigInt(id));
    const result = await this.queryHandler.handle(query);

    return match(result, {
      Ok: (response: ProductResponseDto) => response,
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
