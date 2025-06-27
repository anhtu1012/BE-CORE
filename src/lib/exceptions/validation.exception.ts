import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorMetadata } from './base.exception';

export interface ValidationError {
  field: string;
  value: unknown;
  constraints: string[];
}

export class ValidationException extends BaseException {
  public readonly errors: ValidationError[];

  constructor(
    message: string = 'Validation failed',
    errors: ValidationError[] = [],
    metadata: ErrorMetadata = {},
  ) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', metadata);
    this.errors = errors;
  }

  static fieldRequired(field: string, metadata: ErrorMetadata = {}) {
    return new ValidationException(
      `Field '${field}' is required`,
      [{ field, value: null, constraints: ['required'] }],
      { field, ...metadata },
    );
  }

  static invalidFormat(
    field: string,
    value: unknown,
    expectedFormat: string,
    metadata: ErrorMetadata = {},
  ) {
    return new ValidationException(
      `Field '${field}' has invalid format. Expected: ${expectedFormat}`,
      [{ field, value, constraints: ['format'] }],
      { field, context: { expectedFormat }, ...metadata },
    );
  }

  static outOfRange(
    field: string,
    value: unknown,
    min?: number,
    max?: number,
    metadata: ErrorMetadata = {},
  ) {
    const range =
      min !== undefined && max !== undefined
        ? `between ${min} and ${max}`
        : min !== undefined
          ? `greater than or equal to ${min}`
          : `less than or equal to ${max}`;

    return new ValidationException(
      `Field '${field}' is out of range. Value must be ${range}`,
      [{ field, value, constraints: ['range'] }],
      { field, context: { min, max }, ...metadata },
    );
  }
}
