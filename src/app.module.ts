import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import config from './config/config';
import { AuthModule } from './shared/auth/auth.module';
import { ClerkModule } from './shared/clerk/clerk.module';
import { UserModule } from './modules/users/user.module';
import { MinioModule } from './lib/minio/minio.module';
import { minioConfig } from './config/minio.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        max: 100,
        ttl: 0,
        isGlobal: true,
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<string>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USER'),
        password: configService.get<string>('REDIS_PASSWORD'),
        no_ready_check: true,
      }),
      inject: [ConfigService],
    }),
    MinioModule.forRoot({
      isGlobal: true,
      ...minioConfig,
    }),
    ProductModule,
    FileUploadModule,
    AuthModule,
    ClerkModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
