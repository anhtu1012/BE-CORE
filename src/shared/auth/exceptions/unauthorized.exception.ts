import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor() {
    const errorResponse = {
      message: 'Invalid credentials provided',
      code: 'INVALID_CREDENTIALS',
      statusCode: HttpStatus.UNAUTHORIZED,
      timestamp: new Date().toISOString(),
    };

    super(errorResponse, HttpStatus.UNAUTHORIZED);
  }
}
