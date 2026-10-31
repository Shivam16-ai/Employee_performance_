import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../config/env.js';
import { DatabaseHealthResponse } from '../types/index.js';

// Pool configuration for PostgreSQL
export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const adapter = new PrismaPg(pool);

// Lazy singleton initialization for PrismaClient to handle pre-generation and testing environments
import { PrismaClient } from '../generated/prisma/client.js';

// Singleton instance of PrismaClient
export const prisma = new PrismaClient({ adapter });

export async function getPrismaClient(): Promise<PrismaClient> {
  return prisma;
}

/**
 * Execute real database query to measure connection status, latency and responsiveness
 */
export async function checkDatabaseConnection(): Promise<DatabaseHealthResponse> {
  const startTime = Date.now();
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      const latency = Date.now() - startTime;
      return {
        status: 'connected',
        latency_ms: latency,
        adapter: '@prisma/adapter-pg (pg pool)',
        error: null,
      };
    } finally {
      client.release();
    }
  } catch (error: any) {
    return {
      status: 'disconnected',
      latency_ms: null,
      adapter: '@prisma/adapter-pg (pg pool)',
      error: error?.message || 'Database connection error',
    };
  }
}

/**
 * Graceful database connection termination
 */
export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    await pool.end();
  } catch (err) {
    console.error('Error disconnecting database pool:', err);
  }
}
