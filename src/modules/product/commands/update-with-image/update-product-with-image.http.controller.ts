import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { routesV1 } from '@src/config/app.routes';
import { match } from '@src/lib/utils/result-matcher.util';
import { UpdateProductWithImageCommand } from './update-product-with-image.command';
import { UpdateProductResponseDto } from '../update/update-product.response.dto';
import { UpdateProductWithImageService } from './update-product-with-image.service';
import { resourcesV1 } from '@src/config/app.permission';
import { ClerkAuthGuard } from '@src/shared/auth/guards/clerk-auth.guard';

@ApiTags(`${resourcesV1.PRODUCT.parent} - ${resourcesV1.PRODUCT.name}`)
@Controller(routesV1.product.root)
@UseGuards(ClerkAuthGuard)
export class UpdateProductWithImageHttpController {
  constructor(
    private readonly updateProductService: UpdateProductWithImageService,
  ) {}

  @Put(':id/with-image')
  @ApiOperation({ summary: 'Update a product with image by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'iPhone 15 Pro Max',
          description: 'Updated product name',
        },
        description: {
          type: 'string',
          example: 'Latest iPhone with advanced features',
          description: 'Updated product description',
        },
        price: {
          type: 'number',
          example: 1099.99,
          description: 'Updated product price',
        },
        category: {
          type: 'string',
          example: 'Electronics',
          description: 'Updated product category',
        },
        brand: {
          type: 'string',
          example: 'Apple',
          description: 'Updated product brand',
        },
        stock: {
          type: 'number',
          example: 50,
          description: 'Updated stock quantity',
        },
        isActive: {
          type: 'boolean',
          example: true,
          description: 'Whether product is active',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Updated product image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully with image',
    type: UpdateProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<UpdateProductResponseDto> {
    const command = new UpdateProductWithImageCommand(
      BigInt(id),
      dto.name,
      dto.description,
      dto.price ? parseFloat(dto.price) : undefined,
      dto.category,
      dto.brand,
      dto.stock ? parseInt(dto.stock) : undefined,
      dto.isActive,
      image,
    );

    const result = await this.updateProductService.handle(command);

    return match(result, {
      Ok: (response: UpdateProductResponseDto) => response,
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
