import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/config/app.routes';
import { DeleteProductCommand } from './delete-product.command';
import { DeleteProductResponseDto } from './delete-product.response.dto';
import { DeleteProductService } from './delete-product.service';
import { resourcesV1 } from '@src/config/app.permission';

@ApiTags(`${resourcesV1.PRODUCT.parent} - ${resourcesV1.PRODUCT.name}`)
@Controller(routesV1.product.root)
export class DeleteProductHttpController {
  constructor(private readonly deleteProductService: DeleteProductService) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    type: DeleteProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteProductResponseDto> {
    const command = new DeleteProductCommand(BigInt(id));
    return this.deleteProductService.handle(command);
  }
}
