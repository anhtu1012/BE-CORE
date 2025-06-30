import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../../../shared/auth/guards/clerk-auth.guard';
import { UserService } from './user.service';
import {
  ClerkService,
  SimplifiedUser,
} from '../../../shared/clerk/clerk.service';
import { match } from '@src/lib/utils/result-matcher.util';

@ApiTags('clerk')
@Controller('clerk')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly clerkService: ClerkService,
  ) {}

  @Post('sync')
  @ApiOperation({ summary: 'Đồng bộ tất cả user từ Clerk về database' })
  async syncAllUsersFromClerk(): Promise<{ success: boolean; synced: number }> {
    const users = await this.clerkService.getAllUsers();
    let count = 0;
    for (const user of users) {
      const result = await this.userService.syncOrCreateUser(user);
      match(result, {
        Ok: () => {
          count++;
          return null;
        },
        Err: (error: Error) => {
          throw error;
        },
      });
    }
    return { success: true, synced: count };
  }

  @Post('sync-one')
  @ApiOperation({ summary: 'Đồng bộ một user từ Clerk về database' })
  async syncOneUserFromClerk(
    @Body() user: SimplifiedUser,
  ): Promise<{ success: boolean }> {
    const result = await this.userService.syncOrCreateUser(user);
    match(result, {
      Ok: () => true,
      Err: (error: Error) => {
        throw error;
      },
    });
    return { success: true };
  }
}
