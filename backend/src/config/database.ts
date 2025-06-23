/* ────────────────────────────────────────────────────────────────────────────
   Prisma Client – singleton helper
   Location : backend/src/config/database.ts
   ──────────────────────────────────────────────────────────────────────────── */

import { PrismaClient } from '@prisma/client';

/**
 *  In development Nodemon/Vite/ts-node may hot-reload, causing multiple Prisma
 *  clients to be instantiated. We store the client on the global object so the
 *  same instance is reused across reloads.
 */
declare global {
  // eslint-disable-next-line no-var
  var __PRISMA__: PrismaClient | undefined;
}

// Log prisma queries only in development
const prisma =
  global.__PRISMA__ ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__PRISMA__ = prisma;
}

/* ── Graceful Shutdown ───────────────────────────────────────────────────── */

const gracefulExit = async () => {
  try {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.info('🛑  Prisma disconnected. Exiting process.');
  } catch (err) {
    console.error('Error during Prisma disconnect', err);
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', gracefulExit);  // Ctrl-C
process.on('SIGTERM', gracefulExit); // kill PID

export { prisma };
