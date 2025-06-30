import { Injectable, Logger, Inject } from '@nestjs/common';
import { SimplifiedUser } from '../../../shared/clerk/clerk.service';
import { UserResponseDto } from '../dto/user.response.dto';
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from '../database/user.repository.port';
import { Result, Ok, Err } from 'oxide.ts';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async syncUserFromClerk(
    userData: SimplifiedUser,
  ): Promise<Result<UserResponseDto, Error>> {
    try {
      // Check if user already exists in database
      const existingUser = await this.userRepository.findByClerkId(userData.id);

      if (existingUser) {
        // Update user if they already exist
        this.logger.log(`Updating existing user with Clerk ID: ${userData.id}`);
        const updated = await this.userRepository.updateUser(
          userData.id,
          userData,
        );
        return Ok(this.toUserResponseDto(updated));
      } else {
        // Create user if they don't exist
        this.logger.log(`Creating new user with Clerk ID: ${userData.id}`);
        const created = await this.userRepository.createUser(userData);
        return Ok(this.toUserResponseDto(created));
      }
    } catch (error: unknown) {
      const errMsg =
        error && typeof error === 'object' && 'message' in error
          ? (error as Error).message
          : 'Unknown error';
      this.logger.error(`Error syncing user: ${errMsg}`);
      return Err(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.toUserResponseDto(user));
  }

  async findByClerkId(clerkId: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByClerkId(clerkId);
    return user ? this.toUserResponseDto(user) : null;
  }

  /**
   * Luôn luôn đồng bộ user từ Clerk: nếu đã có thì cập nhật, chưa có thì tạo mới.
   */
  async syncOrCreateUser(
    userData: SimplifiedUser,
  ): Promise<Result<UserResponseDto, Error>> {
    console.log('Syncing or creating user from Clerk:', userData);

    return this.syncUserFromClerk(userData);
  }
  private toUserResponseDto(user: {
    id: string;
    username?: string; // Allow undefined
    firstName?: string; // Allow undefined
    lastName?: string; // Allow undefined
    clerkId: string;
    imageUrl?: string; // Allow undefined
    createdAt: Date;
    updatedAt: Date;
    clerkCreatedAt: bigint;
    clerkUpdatedAt: bigint;
  }): UserResponseDto {
    // Map fields from user entity to UserResponseDto
    return {
      id: user.id,
      username: user.username ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      clerkId: user.clerkId,
      imageUrl: user.imageUrl ?? '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      clerkCreatedAt: user.clerkCreatedAt,
      clerkUpdatedAt: user.clerkUpdatedAt,
    };
  }
}
