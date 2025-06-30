import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@src/lib/exceptions/unauthorized.exception';

@Injectable()
export class ClerkAuthGuard extends AuthGuard('clerk') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Define a User interface or import it if already defined elsewhere
  // interface User { id: string; email: string; /* other fields */ }

  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      if (err && typeof err === 'object' && 'code' in err) {
        // If our custom exception was thrown, rethrow it
        throw err;
      }
      throw UnauthorizedException.invalidCredentials();
    }
    return user as TUser;
  }
}
