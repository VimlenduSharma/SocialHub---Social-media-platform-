import 'dotenv/config';

import http from 'http';
import app from './app';                         // your Express app
import { logger } from './utils/logger';         // your Pino logger
import { prisma } from './config/database';      // your Prisma client

const PORT = Number(process.env.PORT ?? 4000);

async function main() {
  // 2. Connect to the database
  try {
    await prisma.$connect();
    logger.info('✅ Prisma connected');
  } catch (err) {
    logger.error({ err }, '❌ Prisma connection failed');
    process.exit(1);
  }

  // 3. Create & start HTTP server
  const server = http.createServer(app);
  server.listen(PORT, () => {
    logger.info(`🚀 Server listening on http://localhost:${PORT}`);
  });

  // 4. Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`🔌 Received ${signal}, shutting down…`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('💤 Server closed, database disconnected');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  // 5. Unhandled errors
  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, '💥 Unhandled Rejection');
    shutdown('unhandledRejection');
  });
  process.on('uncaughtException', (err) => {
    logger.error({ err }, '💥 Uncaught Exception');
    shutdown('uncaughtException');
  });
}

main();
