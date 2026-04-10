import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from '@/common/auth';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @Public()
  getLiveness() {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  @Public()
  async getReadiness(@Res({ passthrough: true }) response: Response) {
    return this.handleReadiness(response);
  }

  @Get()
  @Public()
  async getHealth(@Res({ passthrough: true }) response: Response) {
    return this.handleReadiness(response);
  }

  private async handleReadiness(response: Response) {
    const readiness = await this.healthService.getHealth();

    if (readiness.status !== 'ready') {
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
    }

    return readiness;
  }
}
