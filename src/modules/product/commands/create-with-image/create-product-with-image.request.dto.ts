import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductWithImageRequestDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Latest iPhone with advanced features',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({ example: 'Electronics', description: 'Product category' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @ApiProperty({ example: 'Apple', description: 'Product brand' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  brand: string;

  @ApiPropertyOptional({ example: 100, description: 'Stock quantity' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  stock?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether product is active',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
