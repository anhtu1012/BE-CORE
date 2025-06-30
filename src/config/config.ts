import type { Config } from './config.interface';

// Configure BigInt serialization globally
(BigInt.prototype as unknown as { toJSON: (this: bigint) => string }).toJSON =
  function (this: bigint): string {
    return this.toString();
  };

const config: Config = {
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'API Documentation',
    description: 'API description',
    version: '1.0',
    path: 'docs',
    bearerAuth: {
      type: 'http', // Specifies the type of authentication
      scheme: 'bearer', // Uses Bearer token
      bearerFormat: 'JWT', // Optional: to specify that it's a JWT
    },
    tokenFieldName: 'accessToken', // Name the auth to use in Swagger interface
  },
  security: {
    expiresIn: '15m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  clerk: {
    // Add your ClerkConfig properties here. Example:
    secretKey: process.env.CLERK_API_KEY || '',
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
    // Add other required ClerkConfig properties as needed
  },
};

export default (): Config => config;
