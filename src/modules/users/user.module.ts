import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClerkService } from '../../shared/clerk/clerk.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { USER_REPOSITORY } from './database/user.repository.port';
import { UserRepositoryPrisma } from './database/user.repository.prisma';
import { UserController } from './command/user.controller';
import { UserService } from './command/user.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryPrisma,
    },
    ClerkService,
    PrismaService,
  ],
  exports: [UserService, USER_REPOSITORY],
})
export class UserModule {}
