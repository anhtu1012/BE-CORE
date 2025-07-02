import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'Folder to upload file to',
    example: 'products',
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class PresignedUrlDto {
  @ApiProperty({
    description: 'Original file name',
    example: 'image.jpg',
  })
  @IsString()
  fileName: string;

  @ApiPropertyOptional({
    description: 'Folder to upload file to',
    example: 'products',
  })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiPropertyOptional({
    description: 'URL expiration time in seconds',
    example: 3600,
    minimum: 60,
    maximum: 86400,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(86400)
  expiresIn?: number;
}

export class FileOperationDto {
  @ApiProperty({
    description: 'Source object name',
    example: 'products/image-123.jpg',
  })
  @IsString()
  sourceObjectName: string;

  @ApiProperty({
    description: 'Target object name',
    example: 'products/renamed-image.jpg',
  })
  @IsString()
  targetObjectName: string;
}

export class DownloadUrlDto {
  @ApiProperty({
    description: 'Object name in MinIO',
    example: 'products/image-123.jpg',
  })
  @IsString()
  objectName: string;

  @ApiPropertyOptional({
    description: 'URL expiration time in seconds',
    example: 3600,
    minimum: 60,
    maximum: 86400,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(86400)
  expiresIn?: number;
}

export class ListFilesDto {
  @ApiPropertyOptional({
    description: 'Prefix to filter files',
    example: 'uploads/images/',
  })
  @IsOptional()
  @IsString()
  prefix?: string;
}

export class DeleteFileDto {
  @ApiProperty({
    description: 'Object name in MinIO to delete',
    example: 'uploads/images/file.jpg',
  })
  @IsString()
  objectName: string;
}

export class GetFileInfoDto {
  @ApiProperty({
    description: 'Object name in MinIO',
    example: 'uploads/images/file.jpg',
  })
  @IsString()
  objectName: string;
}
