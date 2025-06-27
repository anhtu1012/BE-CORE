import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorMetadata } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor(
    message: string = 'Access forbidden',
    code: string = 'FORBIDDEN',
    metadata: ErrorMetadata = {},
  ) {
    super(message, HttpStatus.FORBIDDEN, code, metadata);
  }

  static insufficientPermissions(
    action: string,
    resource: string,
    metadata: ErrorMetadata = {},
  ) {
    return new ForbiddenException(
      `Insufficient permissions to ${action} ${resource}`,
      'INSUFFICIENT_PERMISSIONS',
      { context: { action, resource }, ...metadata },
    );
  }
}
