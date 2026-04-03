import { Injectable } from '@nestjs/common';
import { HealthRepository } from './repository/health.repository';

@Injectable()
export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  async getHealth() {
    let database: 'up' | 'down' | 'not_configured' = 'not_configured';

    if (process.env.DATABASE_URL) {
      try {
        await this.healthRepository.checkDatabaseConnection();
        database = 'up';
      } catch {
        database = 'down';
      }
    }

    return {
      status: 'ok',
      database,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
