import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ClerkService, SimplifiedUser } from './clerk.service';

@ApiTags('clerk')
@Controller('clerk')
@ApiBearerAuth()
export class ClerkController {
  constructor(private readonly clerkService: ClerkService) {}

  @Get('users')
  @UseGuards(ClerkAuthGuard)
  async getAllUsers(): Promise<{ success: boolean; data: SimplifiedUser[] }> {
    const users = await this.clerkService.getAllUsers();
    return {
      success: true,
      data: users,
    };
  }
}
