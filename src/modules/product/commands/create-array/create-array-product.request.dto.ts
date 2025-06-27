import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateProductRequestDto } from '../create/create-product.request.dto';

export class CreateArrayProductRequestDto {
  @ApiProperty({
    description: 'Array of products to create',
    type: [CreateProductRequestDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductRequestDto)
  products: CreateProductRequestDto[];
}
