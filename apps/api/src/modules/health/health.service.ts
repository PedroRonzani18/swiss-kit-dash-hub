import { Injectable } from '@nestjs/common';
import { HealthRepository } from './repositories/health.repository';

type DatabaseHealthStatus = 'up' | 'down' | 'not_configured';

type BaseHealthPayload = {
  timestamp: string;
  uptime: number;
};

type LivenessPayload = BaseHealthPayload & {
  status: 'ok';
};

type ReadyPayload = BaseHealthPayload & {
  status: 'ready';
  checks: {
    database: DatabaseHealthStatus;
  };
};

type NotReadyPayload = BaseHealthPayload & {
  status: 'not_ready';
  checks: {
    database: DatabaseHealthStatus;
  };
};

type ReadinessPayload = ReadyPayload | NotReadyPayload;

@Injectable()
export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  getLiveness(): LivenessPayload {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  async getReadiness(): Promise<ReadinessPayload> {
    const databaseStatus = await this.getDatabaseStatus();

    if (databaseStatus !== 'up') {
      return {
        status: 'not_ready',
        checks: {
          database: databaseStatus,
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    }

    return {
      status: 'ready',
      checks: {
        database: databaseStatus,
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  async getHealth(): Promise<ReadinessPayload> {
    return this.getReadiness();
  }

  private async getDatabaseStatus(): Promise<DatabaseHealthStatus> {
    if (!process.env.DATABASE_URL) {
      return 'not_configured';
    }

    try {
      await this.healthRepository.checkDatabaseConnection();
      return 'up';
    } catch {
      return 'down';
    }
  }
}
