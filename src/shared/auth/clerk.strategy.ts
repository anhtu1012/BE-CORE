import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/clerk-sdk-node';
import { UnauthorizedException } from '@src/lib/exceptions/unauthorized.exception';
import { Guard } from '@src/lib/guard';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(private configService: ConfigService) {
    super();
  }

  async validate(req: { headers?: { authorization?: string } }): Promise<any> {
    const authHeader = req.headers?.authorization;
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw UnauthorizedException.invalidCredentials();
    }

    const token = authHeader.split(' ')[1];
    if (Guard.isEmpty(token)) {
      throw UnauthorizedException.tokenInvalid();
    }

    try {
      const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
      if (!secretKey) {
        throw new Error('CLERK_SECRET_KEY is not defined');
      }

      // Verify token with proper options
      const session = await verifyToken(token, {
        secretKey,
      });

      if (!session) {
        throw UnauthorizedException.tokenInvalid();
      }

      // Extract useful user data from the session
      return {
        userId: session.sub,
        session: session,
        token: token,
        isAuthenticated: true,
      };
    } catch (error) {
      console.error('Clerk verification error:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string' &&
        (error as { message: string }).message.includes('expired')
      ) {
        throw UnauthorizedException.tokenExpired();
      }
      // Optionally log the error message for debugging
      throw UnauthorizedException.tokenInvalid();
    }
  }
}
