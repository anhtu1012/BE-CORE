import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorMetadata } from './base.exception';

export class BusinessException extends BaseException {
  constructor(
    message: string,
    code: string = 'BUSINESS_ERROR',
    metadata: ErrorMetadata = {},
  ) {
    super(message, HttpStatus.BAD_REQUEST, code, metadata);
  }

  static invalidOperation(
    operation: string,
    reason: string,
    metadata: ErrorMetadata = {},
  ) {
    return new BusinessException(
      `Invalid operation: ${operation}. Reason: ${reason}`,
      'INVALID_OPERATION',
      { context: { operation, reason }, ...metadata },
    );
  }

  static insufficientStock(
    productId: string,
    available: number,
    requested: number,
  ) {
    return new BusinessException(
      `Insufficient stock for product ${productId}. Available: ${available}, Requested: ${requested}`,
      'INSUFFICIENT_STOCK',
      { context: { productId, available, requested } },
    );
  }

  static invalidPrice(price: number, productId?: string) {
    return new BusinessException(
      `Invalid price: ${price}. Price must be greater than 0`,
      'INVALID_PRICE',
      { context: { price, productId } },
    );
  }
}
