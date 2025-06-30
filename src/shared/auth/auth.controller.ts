import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(ClerkAuthGuard)
  getProtectedData(
    @CurrentUser() user: { userId: string; isAuthenticated: boolean },
  ) {
    return {
      message: 'This is a protected route',
      userId: user.userId,
      isAuthenticated: user.isAuthenticated,
    };
  }
}
