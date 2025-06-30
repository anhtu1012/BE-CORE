import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClerkService } from './clerk.service';
import { ClerkController } from './clerk.controller';

@Module({
  imports: [ConfigModule],
  providers: [ClerkService],
  exports: [ClerkService],
  controllers: [ClerkController],
})
export class ClerkModule {}
