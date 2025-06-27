import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/config/app.routes';
import { match } from '@src/lib/utils/result-matcher.util';
import { CreateProductCommand } from './create-product.command';
import { CreateProductRequestDto } from './create-product.request.dto';
import { CreateProductResponseDto } from './create-product.response.dto';
import { CreateProductService } from './create-product.service';
import { resourcesV1 } from '@src/config/app.permission';

@ApiTags(`${resourcesV1.PRODUCT.parent} - ${resourcesV1.PRODUCT.name}`)
@Controller(routesV1.product.root)
export class CreateProductHttpController {
  constructor(private readonly createProductService: CreateProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: CreateProductResponseDto,
  })
  async create(
    @Body() dto: CreateProductRequestDto,
  ): Promise<CreateProductResponseDto> {
    const command = new CreateProductCommand(
      dto.name,
      dto.price,
      dto.category,
      dto.brand,
      dto.description,
      dto.stock,
      dto.isActive,
      dto.imageUrl,
    );

    const result = await this.createProductService.handle(command);

    return match(result, {
      Ok: (response: CreateProductResponseDto) => response,
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
