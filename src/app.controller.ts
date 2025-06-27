import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { routesV1 } from './config/app.routes';

@Controller(routesV1.version)
export class AppController {
  @ApiOperation({ summary: 'Health check' })
  @Get(routesV1.healthCheck.root)
  healthCheck(): Promise<unknown> {
    return Promise.resolve('OK');
  }
}
