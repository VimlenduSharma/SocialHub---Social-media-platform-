/* ────────────────────────────────────────────────────────────────────────────
   Lightweight domain error you can `throw` from anywhere
   Location : backend/src/utils/AppError.ts
   ────────────────────────────────────────────────────────────────────────── */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public extra?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    Error.captureStackTrace(this);
  }
}
