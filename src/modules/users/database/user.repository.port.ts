import { SimplifiedUser } from '@src/shared/clerk/clerk.service';
import { UserResponseDto } from '../dto/user.response.dto';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryPort {
  findByClerkId(clerkId: string): Promise<UserResponseDto | null>;
  createUser(userData: SimplifiedUser): Promise<UserResponseDto>;
  updateUser(
    clerkId: string,
    userData: SimplifiedUser,
  ): Promise<UserResponseDto>;
  findAll(): Promise<UserResponseDto[]>;
}
