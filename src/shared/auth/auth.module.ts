import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClerkStrategy } from './clerk.strategy';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'clerk' })],
  providers: [ClerkStrategy, ClerkAuthGuard],
  exports: [ClerkStrategy, ClerkAuthGuard],
})
export class AuthModule {}
