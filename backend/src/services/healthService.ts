import { checkDatabaseConnection } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { HealthResponse, DatabaseHealthResponse } from '../types/index.js';

export class HealthService {
  private static startTime = Date.now();

  static async getSystemHealth(): Promise<HealthResponse> {
    const dbHealth = await checkDatabaseConnection();
    const status = dbHealth.status === 'connected' ? 'healthy' : 'degraded';

    return {
      service: env.APP_NAME,
      version: '1.0.0',
      environment: env.NODE_ENV,
      status,
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.floor((Date.now() - this.startTime) / 1000),
      database: dbHealth,
    };
  }

  static async getDatabaseHealth(): Promise<DatabaseHealthResponse> {
    return await checkDatabaseConnection();
  }
}
