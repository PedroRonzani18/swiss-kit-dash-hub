import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HealthRepository } from './repositories/health.repository';

@Module({
  controllers: [HealthController],
  providers: [HealthService, HealthRepository],
})
export class HealthModule {}
