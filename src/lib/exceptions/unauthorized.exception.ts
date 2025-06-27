import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorMetadata } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(
    message: string = 'Authentication required',
    code: string = 'UNAUTHORIZED',
    metadata: ErrorMetadata = {},
  ) {
    super(message, HttpStatus.UNAUTHORIZED, code, metadata);
  }

  static invalidCredentials(metadata: ErrorMetadata = {}) {
    return new UnauthorizedException(
      'Invalid credentials provided',
      'INVALID_CREDENTIALS',
      metadata,
    );
  }

  static tokenExpired(metadata: ErrorMetadata = {}) {
    return new UnauthorizedException(
      'Authentication token has expired',
      'TOKEN_EXPIRED',
      metadata,
    );
  }

  static tokenInvalid(metadata: ErrorMetadata = {}) {
    return new UnauthorizedException(
      'Invalid authentication token',
      'TOKEN_INVALID',
      metadata,
    );
  }
}
