import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8001),
  HOST: z.string().default('0.0.0.0'),
  APP_NAME: z.string().default('EPMS Enterprise Backend (Node.js)'),
  API_V1_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  LOG_LEVEL: z.string().default('dev'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:', parsedEnv.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = parsedEnv.data;
export type Env = z.infer<typeof envSchema>;
