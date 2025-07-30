import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
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
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Product image URL',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;
}

export class UpdateProductDto {
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

export class ProductResponseDto {
  @ApiProperty({ example: '1', description: 'Product ID' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product name' })
  name: string;

  @ApiPropertyOptional({
    example: 'Latest iPhone with advanced features',
    description: 'Product description',
  })
  description?: string;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  price: number;

  @ApiProperty({ example: 'Electronics', description: 'Product category' })
  category: string;

  @ApiProperty({ example: 'Apple', description: 'Product brand' })
  brand: string;

  @ApiProperty({ example: 100, description: 'Stock quantity' })
  stock: number;

  @ApiProperty({ example: true, description: 'Whether product is active' })
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Product image URL',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 'products/1234abcd.jpg',
    description: 'Product image object key',
  })
  imageKey?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Updated date' })
  updatedAt: Date;
}
