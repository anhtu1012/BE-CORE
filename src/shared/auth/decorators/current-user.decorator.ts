import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

// Extend Express Request interface to include 'user' property
declare module 'express' {
  interface Request {
    user?: any;
  }
}

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): unknown => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: Record<string, unknown> }>();

    if (!request.user) {
      throw new UnauthorizedException();
    }

    // If data is provided, return specific field from user object
    if (data) {
      return (request.user as Record<string, unknown>)[data];
    }

    // Return the entire user object
    return request.user;
  },
);
