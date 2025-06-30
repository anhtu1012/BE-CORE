/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { SimplifiedUser } from '@src/shared/clerk/clerk.service';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class UserRepositoryPrisma implements UserRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async findByClerkId(clerkId: string): Promise<any | null> {
    return await this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async createUser(userData: SimplifiedUser): Promise<any> {
    return await this.prisma.user.create({
      data: {
        clerkId: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        imageUrl: userData.imageUrl,
        clerkCreatedAt: BigInt(userData.createdAt),
        clerkUpdatedAt: BigInt(userData.updatedAt),
      },
    });
  }

  async updateUser(clerkId: string, userData: SimplifiedUser): Promise<any> {
    return await this.prisma.user.update({
      where: { clerkId },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        imageUrl: userData.imageUrl,
        clerkUpdatedAt: BigInt(userData.updatedAt),
      },
    });
  }

  async findAll(): Promise<any[]> {
    return await this.prisma.user.findMany();
  }
}
