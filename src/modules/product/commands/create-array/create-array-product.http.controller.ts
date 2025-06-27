import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/config/app.routes';
import { BulkOperationResponseProps } from '@src/lib/api/bulk-operation-response.base';
import { match } from '@src/lib/utils/result-matcher.util';
import { CreateArrayProductCommand } from './create-array-product.command';
import { CreateArrayProductRequestDto } from './create-array-product.request.dto';
import { CreateArrayProductResponseDto } from './create-array-product.response.dto';
import { CreateArrayProductService } from './create-array-product.service';
import { resourcesV1 } from '@src/config/app.permission';

@ApiTags(`${resourcesV1.PRODUCT.parent} - ${resourcesV1.PRODUCT.name}`)
@Controller(routesV1.product.root)
export class CreateArrayProductHttpController {
  constructor(
    private readonly createArrayProductService: CreateArrayProductService,
  ) {}

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple products at once' })
  @ApiResponse({
    status: 201,
    description: 'Bulk product creation completed',
  })
  async createArray(
    @Body() dto: CreateArrayProductRequestDto,
  ): Promise<CreateArrayProductResponseDto> {
    const command = new CreateArrayProductCommand(dto.products);
    const result = await this.createArrayProductService.handle(command);

    return match(result, {
      Ok: (success: BulkOperationResponseProps<any>) => {
        return new CreateArrayProductResponseDto({
          ...success,
          errors: success.errors,
        });
      },
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
