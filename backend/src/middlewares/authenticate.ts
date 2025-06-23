/* ─────────────────────────────────────────────────────────────────────────────
   Express middleware – Firebase ID-Token verification
   Location : backend/src/middlewares/authenticate.ts
   ──────────────────────────────────────────────────────────────────────────── */

import type { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '@/config/firebaseAdmin';

/**
 *  Reads the Firebase ID token from:
 *    1. `Authorization: Bearer <token>`          (recommended)
 *    2. `req.cookies.token`  (fallback, optional)
 *
 *  On success → attaches  `req.user = { uid, email, name?, picture? }`
 *  On failure  → returns HTTP 401.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // ─── Retrieve the raw token ───────────────────────────────────────────
    let rawToken: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      rawToken = authHeader.split(' ')[1];
    } else if (req.cookies?.token) {
      rawToken = req.cookies.token; // <-- only if you choose to set one on the client
    }

    if (!rawToken) {
      return res.status(401).json({ message: 'Missing authentication token' });
    }

    // ─── Verify with Firebase Admin ───────────────────────────────────────
    const decoded = await verifyIdToken(rawToken);

    // ─── Attach a trimmed user object to the request ──────────────────────
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? '',
      name: decoded.name,
      picture: decoded.picture,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
