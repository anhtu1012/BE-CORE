import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorMetadata } from './base.exception';

export class ConflictException extends BaseException {
  constructor(
    message: string,
    code: string = 'CONFLICT',
    metadata: ErrorMetadata = {},
  ) {
    super(message, HttpStatus.CONFLICT, code, metadata);
  }

  static alreadyExists(
    entityType: string,
    field: string,
    value: string | number,
    metadata: ErrorMetadata = {},
  ) {
    return new ConflictException(
      `${entityType} with ${field} '${value}' already exists`,
      'ALREADY_EXISTS',
      { field, context: { entityType, field, value }, ...metadata },
    );
  }

  static productNameExists(name: string) {
    return this.alreadyExists('Product', 'name', name, { field: 'name' });
  }

  static concurrentModification(
    entityType: string,
    identifier: string | number,
    metadata: ErrorMetadata = {},
  ) {
    return new ConflictException(
      `${entityType} with ID '${identifier}' was modified by another user`,
      'CONCURRENT_MODIFICATION',
      { context: { entityType, identifier }, ...metadata },
    );
  }
}
