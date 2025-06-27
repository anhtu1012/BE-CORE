import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorMetadata } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(
    message: string,
    code: string = 'NOT_FOUND',
    metadata: ErrorMetadata = {},
  ) {
    super(message, HttpStatus.NOT_FOUND, code, metadata);
  }

  static entityNotFound(
    entityType: string,
    identifier: string | number,
    metadata: ErrorMetadata = {},
  ) {
    return new NotFoundException(
      `${entityType} with ID '${identifier}' not found`,
      'ENTITY_NOT_FOUND',
      { context: { entityType, identifier }, ...metadata },
    );
  }

  static productNotFound(id: string | number) {
    return this.entityNotFound('Product', id, { field: 'productId' });
  }

  static resourceNotFound(resource: string, metadata: ErrorMetadata = {}) {
    return new NotFoundException(
      `Resource '${resource}' not found`,
      'RESOURCE_NOT_FOUND',
      { context: { resource }, ...metadata },
    );
  }
}
