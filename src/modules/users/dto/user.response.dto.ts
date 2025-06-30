import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid', description: 'User ID' })
  id: string;

  @ApiPropertyOptional({ example: 'username', description: 'Username' })
  username?: string;

  @ApiPropertyOptional({ example: 'John', description: 'First name' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  lastName?: string;

  @ApiProperty({ example: 'clerk_123', description: 'Clerk ID' })
  clerkId: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
  })
  imageUrl?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Updated date' })
  updatedAt: Date;

  @ApiProperty({
    example: '1712345678901',
    description: 'Clerk created at (bigint)',
  })
  clerkCreatedAt: bigint;

  @ApiProperty({
    example: '1712345678901',
    description: 'Clerk updated at (bigint)',
  })
  clerkUpdatedAt: bigint;
}
