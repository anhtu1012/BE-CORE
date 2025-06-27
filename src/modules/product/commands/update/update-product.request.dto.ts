import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductRequestDto {
  @ApiPropertyOptional({
    example: 'iPhone 15 Pro Max',
    description: 'Product name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated iPhone with more features',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1099.99, description: 'Product price' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiPropertyOptional({
    example: 'Electronics',
    description: 'Product category',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: 'Apple', description: 'Product brand' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({ example: 50, description: 'Stock quantity' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  stock?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether product is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'https://example.com/new-image.jpg',
    description: 'Product image URL',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;
}
