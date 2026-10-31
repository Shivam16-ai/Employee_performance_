import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import apiV1Router from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();

  // Helmet security headers
  app.use(helmet());

  // CORS configuration
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          callback(null, true);
        } else {
          callback(new Error(`CORS error: Origin ${origin} not allowed`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Structured Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.LOG_LEVEL === 'dev' ? 'dev' : 'combined'));
  }

  // Body Parsing
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Root Information Endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      service: env.APP_NAME,
      version: '1.0.0',
      status: 'operational',
      environment: env.NODE_ENV,
      health: `${env.API_V1_PREFIX}/health`,
      database_health: `${env.API_V1_PREFIX}/health/db`,
    });
  });

  // Mount API v1 Routes
  app.use(env.API_V1_PREFIX, apiV1Router);

  // 404 Route Handler
  app.use(notFoundHandler);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
export default app;
