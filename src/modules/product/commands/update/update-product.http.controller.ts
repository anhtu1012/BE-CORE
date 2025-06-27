import { Body, Controller, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/config/app.routes';
import { UpdateProductCommand } from './update-product.command';
import { UpdateProductRequestDto } from './update-product.request.dto';
import { UpdateProductResponseDto } from './update-product.response.dto';
import { UpdateProductService } from './update-product.service';
import { resourcesV1 } from '@src/config/app.permission';

@ApiTags(`${resourcesV1.PRODUCT.parent} - ${resourcesV1.PRODUCT.name}`)
@Controller(routesV1.product.root)
export class UpdateProductHttpController {
  constructor(private readonly updateProductService: UpdateProductService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: UpdateProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductRequestDto,
  ): Promise<UpdateProductResponseDto> {
    const command = new UpdateProductCommand(
      BigInt(id),
      dto.name,
      dto.description,
      dto.price,
      dto.category,
      dto.brand,
      dto.stock,
      dto.isActive,
      dto.imageUrl,
    );
    return this.updateProductService.handle(command);
  }
}
