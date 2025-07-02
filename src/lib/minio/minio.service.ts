import * as Minio from 'minio';
import {
  BucketItemStat,
  CopyObjectResult,
} from 'minio/dist/main/internal/type';
import { Inject, Injectable } from '@nestjs/common';
import { MinioOptions } from './interfaces';
import { MINIO_OPTIONS } from './minio.module-definition';

@Injectable()
export class MinioService {
  private readonly _client: Minio.Client;
  private readonly _bucketName: string;

  constructor(@Inject(MINIO_OPTIONS) private _options: MinioOptions) {
    const { bucketName, ...restOptions } = _options;
    this._client = new Minio.Client(restOptions);
    this._bucketName = bucketName;
  }

  async checkOrCreateBucket(bucketName: string): Promise<void> {
    const exists = await this._client.bucketExists(bucketName);
    if (!exists) {
      await this._client.makeBucket(bucketName);
    }
  }

  async getListObject(prefix?: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const object: string[] = [];
      const rs = this._client.listObjects(this._bucketName, prefix, true);

      rs.on('data', (obj) => {
        object.push(obj.name ?? '');
      });

      rs.on('error', (err) => {
        reject(err);
      });

      rs.on('end', () => {
        resolve(object);
      });
    });
  }

  async getPresignedPutUrl(
    objectName: string,
    expiry?: number,
  ): Promise<string> {
    await this.checkOrCreateBucket(this._bucketName);

    return this._client.presignedPutObject(
      this._bucketName,
      objectName,
      expiry,
    );
  }

  async getPresignedGetUrl(
    objectName: string,
    expiry?: number,
  ): Promise<string> {
    await this.checkOrCreateBucket(this._bucketName);

    return this._client.presignedGetObject(
      this._bucketName,
      objectName,
      expiry,
    );
  }

  async putObject(
    objectName: string,
    buffer: Buffer,
    size?: number,
    metaData?: Minio.ItemBucketMetadata,
  ): Promise<void> {
    // check if objectName already includes bucketName, if yes, remove it
    if (objectName.startsWith(`${this._bucketName}/`)) {
      objectName = objectName.replace(`${this._bucketName}/`, '');
    }

    await this._client.putObject(
      this._bucketName,
      objectName,
      buffer,
      size,
      metaData,
    );
  }

  async getObject(objectName: string): Promise<Buffer> {
    // check if objectName already includes bucketName, if yes, remove it
    if (objectName.startsWith(`${this._bucketName}/`)) {
      objectName = objectName.replace(`${this._bucketName}/`, '');
    }

    const readStream = await this._client.getObject(
      this._bucketName,
      objectName,
    );
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      readStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      readStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readStream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async download(objectName: string, filePath: string): Promise<void> {
    await this._client.fGetObject(this._bucketName, objectName, filePath);
  }

  async getInfoObject(objectName: string): Promise<BucketItemStat> {
    // check if objectName already includes bucketName, if yes, remove it
    if (objectName.startsWith(`${this._bucketName}/`)) {
      objectName = objectName.replace(`${this._bucketName}/`, '');
    }

    return this._client.statObject(this._bucketName, objectName);
  }

  async copy({
    sourceObjectName,
    targetObjectName,
    conditions,
  }: {
    sourceObjectName: string;
    targetObjectName: string;
    conditions?: Minio.CopyConditions;
  }): Promise<CopyObjectResult> {
    await this.checkOrCreateBucket(this._bucketName);

    return this._client.copyObject(
      this._bucketName,
      targetObjectName,
      `${this._bucketName}/${sourceObjectName}`,
      conditions,
    );
  }

  async move(
    sourceObjectName: string,
    targetObjectName: string,
    conditions?: Minio.CopyConditions,
  ): Promise<CopyObjectResult> {
    const copiedObjectResult = await this.copy({
      sourceObjectName,
      targetObjectName,
      conditions,
    });

    // if copy is successful, remove source object
    if (copiedObjectResult) {
      await this.remove(sourceObjectName);
    }

    return copiedObjectResult;
  }

  async remove(objectName: string): Promise<void> {
    await this._client.removeObject(this._bucketName, objectName);
  }
}
