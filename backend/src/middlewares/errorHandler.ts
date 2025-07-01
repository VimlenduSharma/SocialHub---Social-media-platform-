// File: backend/src/middlewares/errorHandler.ts

import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/logger';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let status = 500;
  let message = 'Internal Server Error';
  let extra: Record<string, unknown> | undefined;

  // — Custom domain errors
  if (err instanceof AppError) {
    status  = err.statusCode;
    message = err.message;
    extra   = err.extra;
  }
  // — Zod validation errors
  else if (err instanceof ZodError) {
    status  = 400;
    message = 'Validation error';
    extra   = { errors: err.flatten() };
  }
  // — Prisma ORM errors
 else if (err instanceof (Prisma as any).PrismaClientKnownRequestError) {
  status  = 400;
  message = 'Database error';
  extra   = { code: (err as any).code, meta: (err as any).meta };
}
  // — Any other “AppError-like” objects
  else if (typeof err === 'object' && err && 'statusCode' in err) {
    status  = (err as any).statusCode;
    message = (err as any).message || message;
  }

  // Log full error in development
  if (process.env.NODE_ENV === 'development') {
    logger.error({ err }, '💥 Unhandled error');
  }

  return res.status(status).json({ message, ...(extra ? extra : {}) });
};
