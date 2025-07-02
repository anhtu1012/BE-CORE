import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileUploadService } from '../file-upload.service';
import { DeleteFileCommand } from './delete-file.command';
import { Result } from 'oxide.ts';

@Injectable()
@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand> {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async execute(command: DeleteFileCommand): Promise<Result<boolean, Error>> {
    return await this.fileUploadService.deleteFile(command.objectName);
  }
}
