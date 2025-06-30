import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface Config {
  cors: CorsConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
  clerk: ClerkConfig;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
  bearerAuth: SecuritySchemeObject;
  tokenFieldName: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface ClerkConfig {
  secretKey: string;
  publishableKey: string;
}
