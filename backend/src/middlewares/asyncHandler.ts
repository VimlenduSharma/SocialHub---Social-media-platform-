/* ─────────────────────────────────────────────────────────────────────────────
   asyncHandler – Wraps async Express route handlers
   Location : backend/src/middlewares/asyncHandler.ts
   ──────────────────────────────────────────────────────────────────────────── */

import type { RequestHandler } from 'express';

/**
 *  Usage:
 *    router.get('/', asyncHandler(postController.listFeed));
 *
 *  Any error (thrown or rejected) inside the handler will be forwarded to
 *  Express’s `.use(errorHandler)` middleware rather than causing an
 *  UnhandledPromiseRejection.
 */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
