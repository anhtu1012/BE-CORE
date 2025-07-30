import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MinioService } from '@src/lib/minio/minio.service';
import { Err, Ok, Result } from 'oxide.ts';
import * as path from 'path';
export interface UploadResult {
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  objectName: string;
  url?: string; // Making URL optional as we may not always need it
}

export interface PresignedUrlResult {
  uploadUrl: string;
  objectName: string;
  expiresIn: number;
}

@Injectable()
export class FileUploadService {
  constructor(private readonly minioService: MinioService) {}
  private generateShortId(): string {
    const timestamp = Date.now().toString().slice(-4);
    const randomChars = Math.random().toString(36).substring(2, 10);
    return `${timestamp}${randomChars}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<Result<UploadResult, Error>> {
    try {
      if (!file) {
        return Err(new BadRequestException('No file provided'));
      }

      // Generate shorter unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${this.generateShortId()}${fileExtension}`;
      const objectName = folder ? `${folder}/${fileName}` : fileName;

      // Upload to MinIO
      await this.minioService.putObject(objectName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
        'X-Original-Name': file.originalname,
      });

      // Generate result without including URL by default
      const result: UploadResult = {
        fileName,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        objectName,
      };

      return Ok(result);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<Result<UploadResult[], Error>> {
    try {
      if (!files || files.length === 0) {
        return Err(new BadRequestException('No files provided'));
      }

      const uploadPromises = files.map((file) => this.uploadFile(file, folder));
      const results = await Promise.all(uploadPromises);

      const errors = results.filter((result) => result.isErr());
      if (errors.length > 0) {
        return Err(new Error(`Failed to upload ${errors.length} files`));
      }

      const successResults = results.map((result) => result.unwrap());
      return Ok(successResults);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async deleteFile(objectName: string): Promise<Result<boolean, Error>> {
    try {
      await this.minioService.remove(objectName);
      return Ok(true);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getFileInfo(objectName: string): Promise<Result<any, Error>> {
    try {
      const info = await this.minioService.getInfoObject(objectName);
      return Ok(info);
    } catch {
      return Err(new NotFoundException('File not found'));
    }
  }

  async getPresignedUploadUrl(
    fileName: string,
    folder?: string,
    expiresIn: number = 3600, // 1 hour
  ): Promise<Result<PresignedUrlResult, Error>> {
    try {
      const fileExtension = path.extname(fileName);
      const uniqueFileName = `${this.generateShortId()}${fileExtension}`;
      const objectName = folder
        ? `${folder}/${uniqueFileName}`
        : uniqueFileName;

      const uploadUrl = await this.minioService.getPresignedPutUrl(
        objectName,
        expiresIn,
      );

      const result: PresignedUrlResult = {
        uploadUrl,
        objectName,
        expiresIn,
      };

      return Ok(result);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getPresignedDownloadUrl(
    objectName: string,
    expiresIn: number = 3600, // 1 hour
  ): Promise<Result<string, Error>> {
    try {
      const url = await this.minioService.getPresignedGetUrl(
        objectName,
        expiresIn,
      );
      return Ok(url);
    } catch {
      return Err(new NotFoundException('File not found'));
    }
  }

  async listFiles(prefix?: string): Promise<Result<string[], Error>> {
    try {
      const files = await this.minioService.getListObject(prefix);
      return Ok(files);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async moveFile(
    sourceObjectName: string,
    targetObjectName: string,
  ): Promise<Result<boolean, Error>> {
    try {
      await this.minioService.move(sourceObjectName, targetObjectName);
      return Ok(true);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async copyFile(
    sourceObjectName: string,
    targetObjectName: string,
  ): Promise<Result<boolean, Error>> {
    try {
      await this.minioService.copy({
        sourceObjectName,
        targetObjectName,
      });
      return Ok(true);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  // Helper method to get URL for an object name
  async getFileUrl(
    objectName: string,
    expiry: number = 24 * 60 * 60,
  ): Promise<Result<string, Error>> {
    try {
      const url = await this.minioService.getPresignedGetUrl(
        objectName,
        expiry,
      );
      return Ok(url);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
