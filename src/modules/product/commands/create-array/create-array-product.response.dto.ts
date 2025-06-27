import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BulkOperationResponseBase } from '@src/lib/api/bulk-operation-response.base';
import { CreateProductRequestDto } from '../create/create-product.request.dto';

export class CreateArrayProductResponseDto extends BulkOperationResponseBase<CreateProductRequestDto> {
  @ApiProperty({
    example: 5,
    description: 'Number of products created successfully',
  })
  declare createdSuccess: number;

  @ApiProperty({
    example: 0,
    description: 'Number of products updated successfully',
  })
  declare updatedSuccess: number;

  @ApiProperty({ example: 2, description: 'Number of errors occurred' })
  declare errorCount: number;

  @ApiPropertyOptional({
    description: 'Array of errors if any occurred',
    nullable: true,
  })
  declare errors: any[] | null;
}
