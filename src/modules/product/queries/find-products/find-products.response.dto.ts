import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindProductsItemResponseDto {
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

export class FindProductsResponseDto {
  @ApiProperty({ example: 100, description: 'Total count of products' })
  count: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;
  @ApiProperty({ type: [FindProductsItemResponseDto] })
  data: FindProductsItemResponseDto[];
}
