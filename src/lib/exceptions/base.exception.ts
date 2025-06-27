import { HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorMetadata {
  code?: string;
  field?: string;
  context?: Record<string, any>;
  timestamp?: Date;
  requestId?: string;
}

export abstract class BaseException extends HttpException {
  public readonly code: string;
  public readonly metadata: ErrorMetadata;

  constructor(
    message: string,
    status: HttpStatus,
    code: string,
    metadata: ErrorMetadata = {},
  ) {
    super(
      {
        message,
        code,
        statusCode: status,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
      status,
    );

    this.code = code;
    this.metadata = {
      timestamp: new Date(),
      ...metadata,
    };
  }

  toJSON() {
    return {
      name: this.constructor.name,
      message: this.message,
      code: this.code,
      statusCode: this.getStatus(),
      metadata: this.metadata,
    };
  }
}
