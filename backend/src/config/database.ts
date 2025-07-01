import { PrismaClient } from '@prisma/client';
declare global {
  // eslint-disable-next-line no-var
  var __PRISMA__: PrismaClient | undefined;
}

// Log prisma queries only in development
const prisma =
  global.__PRISMA__ ??
  new PrismaClient({
    datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
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
