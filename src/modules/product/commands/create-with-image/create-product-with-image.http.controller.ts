import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { routesV1 } from '@src/config/app.routes';
import { match } from '@src/lib/utils/result-matcher.util';
import { CreateProductWithImageCommand } from './create-product-with-image.command';
import { CreateProductWithImageRequestDto } from './create-product-with-image.request.dto';
import { CreateProductResponseDto } from '../create/create-product.response.dto';
import { CreateProductWithImageService } from './create-product-with-image.service';
import { resourcesV1 } from '@src/config/app.permission';
import { ClerkAuthGuard } from '@src/shared/auth/guards/clerk-auth.guard';
import { CurrentUser } from '@src/shared/auth/decorators/current-user.decorator';

@ApiTags(`${resourcesV1.PRODUCT.parent} - ${resourcesV1.PRODUCT.name}`)
@Controller(routesV1.product.root)
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class CreateProductWithImageHttpController {
  constructor(
    private readonly createProductService: CreateProductWithImageService,
  ) {}

  @Post('with-image')
  @ApiOperation({ summary: 'Create a new product with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'iPhone 15 Pro',
          description: 'Product name',
        },
        description: {
          type: 'string',
          example: 'Latest iPhone with advanced features',
          description: 'Product description',
        },
        price: {
          type: 'number',
          example: 999.99,
          description: 'Product price',
        },
        category: {
          type: 'string',
          example: 'Electronics',
          description: 'Product category',
        },
        brand: {
          type: 'string',
          example: 'Apple',
          description: 'Product brand',
        },
        stock: {
          type: 'number',
          example: 100,
          description: 'Stock quantity',
        },
        isActive: {
          type: 'boolean',
          example: true,
          description: 'Whether product is active',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image file',
        },
      },
      required: ['name', 'price', 'category', 'brand'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully with image',
    type: CreateProductResponseDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async createWithImage(
    @Body() dto: CreateProductWithImageRequestDto,
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: { userId: string },
  ): Promise<CreateProductResponseDto> {
    const command = new CreateProductWithImageCommand(
      dto.name,
      dto.price,
      dto.category,
      dto.brand,
      dto.description,
      dto.stock,
      // Fix: Properly convert various input types to boolean without type errors
      dto.isActive === Boolean(dto.isActive),
      image,
      user.userId,
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
