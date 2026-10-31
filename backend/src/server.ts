import { app } from './app.js';
import { env } from './config/env.js';
import { checkDatabaseConnection, disconnectPrisma } from './lib/prisma.js';

const server = app.listen(env.PORT, env.HOST, async () => {
  console.log(`🚀 ${env.APP_NAME} running at http://${env.HOST}:${env.PORT}`);
  console.log(`📡 Environment: [${env.NODE_ENV}]`);
  console.log(`🔗 Health Check: http://${env.HOST}:${env.PORT}${env.API_V1_PREFIX}/health`);

  // Initial connection test
  const dbHealth = await checkDatabaseConnection();
  if (dbHealth.status === 'connected') {
    console.log(
      `✅ PostgreSQL connected via ${dbHealth.adapter} (Latency: ${dbHealth.latency_ms}ms)`
    );
  } else {
    console.warn(`⚠️ PostgreSQL connection warning: ${dbHealth.error}`);
  }
});

// Graceful Shutdown Handler
let isShuttingDown = false;

async function handleGracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(async (err) => {
    if (err) {
      console.error('Error closing HTTP server:', err);
      process.exit(1);
    }

    console.log('🔌 HTTP server closed. Disconnecting database...');
    await disconnectPrisma();
    console.log('✅ Graceful shutdown completed cleanly.');
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.error('⚠️ Shutdown timeout exceeded (10s). Forcing termination.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

export default server;
