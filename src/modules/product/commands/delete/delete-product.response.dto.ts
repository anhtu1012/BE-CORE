import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductResponseDto {
  @ApiProperty({
    example: 'Product deleted successfully',
    description: 'Success message',
  })
  message: string;
}
