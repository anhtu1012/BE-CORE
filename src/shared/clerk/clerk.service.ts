import { clerkClient } from '@clerk/express';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ClerkError extends Error {
  status?: number;
  message: string;
}

// Define interface for simplified user data
export interface SimplifiedUser {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: number;
  updatedAt: number;
  imageUrl: string | null;
}

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);

  constructor(private configService: ConfigService) {
    // More robust key retrieval with logging and fallbacks
    const secretKey =
      this.configService.get<string>('clerk.secretKey') ||
      this.configService.get<string>('CLERK_SECRET_KEY') ||
      process.env.CLERK_SECRET_KEY;

    this.logger.log(`Clerk config available: ${!!this.configService}`);
    this.logger.log(`Clerk secret key found: ${!!secretKey}`);

    if (!secretKey) {
      this.logger.error(
        'CLERK_SECRET_KEY is not defined in configuration or environment',
      );
      throw new Error('CLERK_SECRET_KEY is not defined');
    }

    // Initialize Clerk SDK with the secret key
    process.env.CLERK_SECRET_KEY = secretKey;

    // Verify the key is set
    this.logger.log(
      `CLERK_SECRET_KEY is now set in environment: ${!!process.env.CLERK_SECRET_KEY}`,
    );
  }

  async getAllUsers(): Promise<SimplifiedUser[]> {
    try {
      // Using Clerk SDK to get users
      const response = await clerkClient.users.getUserList();

      // Transform data to only include required fields
      const users = response.data.map((user) => ({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        imageUrl: user.imageUrl,
      }));

      return users;
    } catch (error: unknown) {
      // Properly type the error object
      const clerkError = error as ClerkError;

      this.logger.error(
        `Error fetching users from Clerk: ${clerkError.message}`,
      );

      // Handle different error cases
      if (clerkError?.status === 401 || clerkError?.status === 403) {
        throw new InternalServerErrorException(
          'Authentication error with Clerk service',
        );
      } else if (!clerkError?.status) {
        throw new ServiceUnavailableException('Clerk service is unavailable');
      } else {
        throw new InternalServerErrorException(
          `Clerk service error: ${clerkError.message || 'Unknown error'}`,
        );
      }
    }
  }
}
