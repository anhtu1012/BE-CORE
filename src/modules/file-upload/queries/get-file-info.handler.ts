import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FileUploadService } from '../file-upload.service';
import { GetFileInfoQuery } from './get-file-info.query';
import { Result } from 'oxide.ts';

@Injectable()
@QueryHandler(GetFileInfoQuery)
export class GetFileInfoHandler implements IQueryHandler<GetFileInfoQuery> {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async execute(query: GetFileInfoQuery): Promise<Result<any, Error>> {
    return await this.fileUploadService.getFileInfo(query.objectName);
  }
}
