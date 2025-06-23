/* ─────────────────────────────────────────────────────────────────────────────
   Centralised Error Middleware
   Location : backend/src/middlewares/errorHandler.ts
   ──────────────────────────────────────────────────────────────────────────── */

import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '@/utils/AppError';

/**
 *  Converts any thrown/rejected error into a JSON response:
 *    { message, extra? }
 *
 *  • Zod validation errors  → 400  + flattened details
 *  • Prisma known errors    → 400  + code/meta
 *  • AppError (our own)     → custom status + message
 *  • Everything else        → 500  Internal Server Error
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let status  = 500;
  let message = 'Internal Server Error';
  let extra: Record<string, unknown> | undefined;

  // ─── Custom domain errors ────────────────────────────────────────────────
  if (err instanceof AppError) {
    status  = err.statusCode;
    message = err.message;
    extra   = err.extra;
  }

  // ─── Zod validation errors ───────────────────────────────────────────────
  else if (err instanceof ZodError) {
    status  = 400;
    message = 'Validation error';
    extra   = { errors: err.flatten() };
  }

  // ─── Prisma ORM errors ───────────────────────────────────────────────────
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    status  = 400;
    message = 'Database error';
    extra   = { code: err.code, meta: err.meta };
  }

  // ─── Fallback: allow objects that carry statusCode/message fields ────────
  else if (typeof err === 'object' && err && 'statusCode' in err) {
    status  = (err as any).statusCode;
    message = (err as any).message || message;
  }

  /* eslint-disable no-console */
  if (process.env.NODE_ENV === 'development') {
    console.error('💥  Unhandled error:', err);
  }
  /* eslint-enable  no-console */

  return res.status(status).json({ message, ...(extra ? { extra } : {}) });
};
