/* ─────────────────────────────────────────────────────────────────────────────
   Firebase Admin SDK – initialise once & expose helpers
   Location : backend/src/config/firebaseAdmin.ts
   ──────────────────────────────────────────────────────────────────────────── */

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';

/**
 *  Initialise Firebase Admin **exactly once** (hot-reload safe).
 *  Credentials come from environment variables so they’re never committed.
 */
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      /**
       *  GitHub Actions / .env files usually store new-lines in the private key
       *  escaped (`\n`).  Replace them so Firebase receives the real key.
       */
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

/* -------------------------------------------------------------------------- */
/*                                   Auth                                     */
/* -------------------------------------------------------------------------- */

const adminAuth = getAuth();

/**
 *  Verify an incoming Firebase ID token (from the `Authorization: Bearer …`
 *  header).  Throws if invalid/expired.
 */
export const verifyIdToken = async (idToken: string): Promise<DecodedIdToken> =>
  adminAuth.verifyIdToken(idToken);

export { adminAuth };
