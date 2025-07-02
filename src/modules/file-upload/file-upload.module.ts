import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MulterModule } from '@nestjs/platform-express';
import { DeleteFileHandler } from './commands/delete-file.handler';
import { GetFileInfoHandler } from './queries/get-file-info.handler';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

const commandHandlers = [DeleteFileHandler];
const queryHandlers = [GetFileInfoHandler];

@Module({
  imports: [
    CqrsModule,
    MulterModule.register({
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService, ...commandHandlers, ...queryHandlers],
  exports: [FileUploadService, ...commandHandlers, ...queryHandlers],
})
export class FileUploadModule {}
