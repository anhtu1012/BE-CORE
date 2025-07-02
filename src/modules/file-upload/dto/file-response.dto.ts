import { ApiProperty } from '@nestjs/swagger';

export class UploadResultDto {
  @ApiProperty({ description: 'Generated file name' })
  fileName: string;

  @ApiProperty({ description: 'Original file name' })
  originalName: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'File MIME type' })
  mimeType: string;

  @ApiProperty({ description: 'File download URL' })
  url: string;

  @ApiProperty({ description: 'Object name in MinIO' })
  objectName: string;
}

export class PresignedUrlResponseDto {
  @ApiProperty({ description: 'Presigned upload URL' })
  uploadUrl: string;

  @ApiProperty({ description: 'Object name for the file' })
  objectName: string;

  @ApiProperty({ description: 'URL expiration time in seconds' })
  expiresIn: number;
}

export class FileListResponseDto {
  @ApiProperty({ description: 'List of file names', type: [String] })
  files: string[];
}

export class FileInfoResponseDto {
  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'Last modified date' })
  lastModified: Date;

  @ApiProperty({ description: 'File ETag' })
  etag: string;

  @ApiProperty({ description: 'Content type' })
  contentType?: string;
}

export class OperationResultDto {
  @ApiProperty({ description: 'Operation success status' })
  success: boolean;

  @ApiProperty({ description: 'Operation message' })
  message: string;
}
