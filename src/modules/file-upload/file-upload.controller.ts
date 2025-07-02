import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { ClerkAuthGuard } from '@src/shared/auth/guards/clerk-auth.guard';
import { match } from '@src/lib/utils/result-matcher.util';
import {
  UploadFileDto,
  PresignedUrlDto,
  FileOperationDto,
  DownloadUrlDto,
  ListFilesDto,
} from './dto/upload-file.dto';
import {
  UploadResultDto,
  PresignedUrlResponseDto,
  FileListResponseDto,
  FileInfoResponseDto,
  OperationResultDto,
} from './dto/file-response.dto';
import { DeleteFileCommand } from './commands/delete-file.command';
import { GetFileInfoQuery } from './queries/get-file-info.query';

@ApiTags('Quản lý tệp tin')
@Controller('files')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Tải lên một tệp tin' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp tin cần tải lên',
        },
        folder: {
          type: 'string',
          description: 'Thư mục lưu trữ (tùy chọn)',
          example: 'san-pham/hinh-anh',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tải lên tệp tin thành công',
    type: UploadResultDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<UploadResultDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.fileUploadService.uploadFile(
      file,
      uploadFileDto.folder,
    );

    return match(result, {
      Ok: (data: UploadResultDto) => data,
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Post('upload-multiple')
  @ApiOperation({ summary: 'Tải lên nhiều tệp tin cùng lúc' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Danh sách tệp tin cần tải lên (tối đa 10 tệp)',
        },
        folder: {
          type: 'string',
          description: 'Thư mục lưu trữ (tùy chọn)',
          example: 'san-pham/hinh-anh',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tải lên nhiều tệp tin thành công',
    type: [UploadResultDto],
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @UploadedFiles() files: any[],
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<UploadResultDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const result = await this.fileUploadService.uploadMultipleFiles(
      files,
      uploadFileDto.folder,
    );

    return match(result, {
      Ok: (data: UploadResultDto[]) => data,
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Post('presigned-upload-url')
  @ApiOperation({ summary: 'Tạo URL ký trước để tải lên tệp tin' })
  @ApiResponse({
    status: 200,
    description: 'Tạo URL ký trước thành công',
    type: PresignedUrlResponseDto,
  })
  async getPresignedUploadUrl(
    @Body() presignedUrlDto: PresignedUrlDto,
  ): Promise<PresignedUrlResponseDto> {
    const result = await this.fileUploadService.getPresignedUploadUrl(
      presignedUrlDto.fileName,
      presignedUrlDto.folder,
      presignedUrlDto.expiresIn,
    );

    return match(result, {
      Ok: (data: PresignedUrlResponseDto) => data,
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Post('presigned-download-url')
  @ApiOperation({ summary: 'Tạo URL ký trước để tải xuống tệp tin' })
  @ApiResponse({
    status: 200,
    description: 'Tạo URL tải xuống thành công',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL tải xuống có thời hạn',
          example:
            'https://minio.example.com/bucket/file.jpg?X-Amz-Algorithm=...',
        },
      },
    },
  })
  async getPresignedDownloadUrl(
    @Body() downloadUrlDto: DownloadUrlDto,
  ): Promise<{ url: string }> {
    const result = await this.fileUploadService.getPresignedDownloadUrl(
      downloadUrlDto.objectName,
      downloadUrlDto.expiresIn,
    );

    return match(result, {
      Ok: (url: string) => ({ url }),
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Get(':objectName/download')
  @ApiOperation({ summary: 'Lấy URL tải xuống cho tệp tin' })
  @ApiParam({
    name: 'objectName',
    description: 'Tên đối tượng trong MinIO (đã mã hóa URL)',
    example: 'san-pham%2Fhinh-anh%2Ffile.jpg',
  })
  @ApiQuery({
    name: 'expiresIn',
    description: 'Thời gian hết hạn URL (giây)',
    required: false,
    example: 3600,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy URL tải xuống thành công',
    schema: {
      type: 'object',
      properties: {
        downloadUrl: {
          type: 'string',
          description: 'URL tải xuống có thời hạn',
        },
      },
    },
  })
  async getDownloadUrl(
    @Param('objectName') objectName: string,
    @Query('expiresIn') expiresIn?: number,
  ): Promise<{ downloadUrl: string }> {
    const decodedObjectName = decodeURIComponent(objectName);
    const result = await this.fileUploadService.getPresignedDownloadUrl(
      decodedObjectName,
      expiresIn || 3600,
    );

    return match(result, {
      Ok: (url: string) => ({ downloadUrl: url }),
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Get('list')
  @ApiOperation({ summary: 'Liệt kê danh sách tệp tin' })
  @ApiQuery({
    name: 'prefix',
    required: false,
    description: 'Tiền tố để lọc tệp tin (ví dụ: thư mục)',
    example: 'san-pham/hinh-anh/',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách tệp tin thành công',
    type: FileListResponseDto,
  })
  async listFiles(
    @Query() listFilesDto: ListFilesDto,
  ): Promise<FileListResponseDto> {
    const result = await this.fileUploadService.listFiles(listFilesDto.prefix);

    return match(result, {
      Ok: (files: string[]) => ({ files }),
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Get(':objectName/info')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết của tệp tin' })
  @ApiParam({
    name: 'objectName',
    description: 'Tên đối tượng trong MinIO (đã mã hóa URL)',
    example: 'san-pham%2Fhinh-anh%2Ffile.jpg',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin tệp tin thành công',
    type: FileInfoResponseDto,
  })
  async getFileInfo(
    @Param('objectName') objectName: string,
  ): Promise<FileInfoResponseDto> {
    const decodedObjectName = decodeURIComponent(objectName);
    const query = new GetFileInfoQuery(decodedObjectName);
    const result = await this.queryBus.execute(query);

    return match(result, {
      Ok: (info: FileInfoResponseDto) => info,
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Delete(':objectName')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa tệp tin khỏi hệ thống' })
  @ApiParam({
    name: 'objectName',
    description: 'Tên đối tượng trong MinIO (đã mã hóa URL)',
    example: 'san-pham%2Fhinh-anh%2Ffile.jpg',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa tệp tin thành công',
    type: OperationResultDto,
  })
  async deleteFile(
    @Param('objectName') objectName: string,
  ): Promise<OperationResultDto> {
    const decodedObjectName = decodeURIComponent(objectName);
    const command = new DeleteFileCommand(decodedObjectName);
    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: () => ({ success: true, message: 'Xóa tệp tin thành công' }),
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Post('move')
  @ApiOperation({ summary: 'Di chuyển tệp tin sang vị trí khác' })
  @ApiResponse({
    status: 200,
    description: 'Di chuyển tệp tin thành công',
    type: OperationResultDto,
  })
  async moveFile(
    @Body() fileOperationDto: FileOperationDto,
  ): Promise<OperationResultDto> {
    const result = await this.fileUploadService.moveFile(
      fileOperationDto.sourceObjectName,
      fileOperationDto.targetObjectName,
    );

    return match(result, {
      Ok: () => ({ success: true, message: 'Di chuyển tệp tin thành công' }),
      Err: (error: Error) => {
        throw error;
      },
    });
  }

  @Post('copy')
  @ApiOperation({ summary: 'Sao chép tệp tin sang vị trí khác' })
  @ApiResponse({
    status: 200,
    description: 'Sao chép tệp tin thành công',
    type: OperationResultDto,
  })
  async copyFile(
    @Body() fileOperationDto: FileOperationDto,
  ): Promise<OperationResultDto> {
    const result = await this.fileUploadService.copyFile(
      fileOperationDto.sourceObjectName,
      fileOperationDto.targetObjectName,
    );

    return match(result, {
      Ok: () => ({ success: true, message: 'Sao chép tệp tin thành công' }),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
