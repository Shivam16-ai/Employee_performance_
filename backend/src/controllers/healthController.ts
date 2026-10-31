import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/healthService.js';

export class HealthController {
  static async getHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = await HealthService.getSystemHealth();
      const statusCode = health.status === 'healthy' ? 200 : 200; // Return 200 with degraded indicator for health check monitoring
      res.status(statusCode).json(health);
    } catch (error) {
      next(error);
    }
  }

  static async getDatabaseHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbHealth = await HealthService.getDatabaseHealth();
      const statusCode = dbHealth.status === 'connected' ? 200 : 503;
      res.status(statusCode).json(dbHealth);
    } catch (error) {
      next(error);
    }
  }
}
