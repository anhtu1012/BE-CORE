import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { routesV1 } from '@src/config/app.routes';
import { match } from '@src/lib/utils/result-matcher.util';
import { CreateProductCommand } from './create-product.command';
import { CreateProductRequestDto } from './create-product.request.dto';
import { CreateProductResponseDto } from './create-product.response.dto';
import { CreateProductService } from './create-product.service';
import { resourcesV1 } from '@src/config/app.permission';
import { ClerkAuthGuard } from '@src/shared/auth/guards/clerk-auth.guard';
import { CurrentUser } from '@src/shared/auth/decorators/current-user.decorator';

@ApiTags(`${resourcesV1.PRODUCT.parent} - ${resourcesV1.PRODUCT.name}`)
@Controller(routesV1.product.root)
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class CreateProductHttpController {
  constructor(private readonly createProductService: CreateProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: CreateProductResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials provided',
  })
  async create(
    @Body() dto: CreateProductRequestDto,
    @CurrentUser() user: { userId: string },
  ): Promise<CreateProductResponseDto> {
    const command = new CreateProductCommand(
      dto.name,
      dto.price,
      dto.category,
      dto.brand,
      dto.description ?? '',
      dto.stock ?? 0,
      dto.isActive ?? false,
      user.userId, // Pass the userId from the current user
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
