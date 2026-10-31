import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { checkDatabaseConnection, disconnectPrisma, pool } from '../src/lib/prisma.js';

describe('EPMS Backend API & Foundation Tests', () => {
  afterAll(async () => {
    await disconnectPrisma();
  });

  describe('Root Info Endpoint', () => {
    it('GET / should return service metadata and operational status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('service');
      expect(res.body.status).toBe('operational');
      expect(res.body.health).toBe('/api/v1/health');
      expect(res.body.database_health).toBe('/api/v1/health/db');
    });
  });

  describe('CORS & Security Headers', () => {
    it('should include Helmet security headers', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.headers).toHaveProperty('x-dns-prefetch-control');
      expect(res.headers).toHaveProperty('x-frame-options');
    });

    it('should allow CORS requests from configured origin (http://localhost:3000)', async () => {
      const res = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:3000');
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('Health Endpoints', () => {
    it('GET /api/v1/health should return system status and database health', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('service');
      expect(res.body).toHaveProperty('version', '1.0.0');
      expect(res.body).toHaveProperty('uptime_seconds');
      expect(res.body).toHaveProperty('database');
      expect(res.body.database.status).toBe('connected');
      expect(typeof res.body.database.latency_ms).toBe('number');
      expect(res.body.database.adapter).toContain('@prisma/adapter-pg');
    });

    it('GET /api/v1/health/db should verify direct PostgreSQL connectivity', async () => {
      const res = await request(app).get('/api/v1/health/db');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('connected');
      expect(typeof res.body.latency_ms).toBe('number');
      expect(res.body.adapter).toContain('@prisma/adapter-pg');
      expect(res.body.error).toBeNull();
    });
  });

  describe('Database Connection & Direct Ping', () => {
    it('checkDatabaseConnection should successfully ping PostgreSQL and report latency', async () => {
      const result = await checkDatabaseConnection();
      expect(result.status).toBe('connected');
      expect(typeof result.latency_ms).toBe('number');
      expect(result.latency_ms).toBeGreaterThanOrEqual(0);
      expect(result.error).toBeNull();
    });
  });

  describe('Error Handling Middleware', () => {
    it('GET /api/v1/non-existent-endpoint should return 404 with structured JSON', async () => {
      const res = await request(app).get('/api/v1/non-existent-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Route not found');
    });
  });

  describe('Resilience & Failure Handling', () => {
    it('checkDatabaseConnection should handle database connection failures gracefully', async () => {
      // Temporarily mock pool.connect to simulate failure
      const originalConnect = pool.connect.bind(pool);
      pool.connect = async () => {
        throw new Error('Connection refused by PostgreSQL server');
      };

      try {
        const failureResult = await checkDatabaseConnection();
        expect(failureResult.status).toBe('disconnected');
        expect(failureResult.latency_ms).toBeNull();
        expect(failureResult.error).toContain('Connection refused');
      } finally {
        pool.connect = originalConnect;
      }
    });
  });
});
