import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductRequestDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: number;
}
