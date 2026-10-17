import type { RequestHandler } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { env } from '#app/env.ts';
import { app } from '#app/lib/firebase/app.ts';

const allowedUids = new Set(env.CACHE_INVALIDATION_ALLOWED_UIDS);

/** Lets only requests with the Firebase ID token of an allowed admin pass. */
export const requireAdmin: RequestHandler = async (req, res, next) => {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer (.+)$/);

  if (!match) {
    res.status(401).json({ status: 401, error: 'Authentication required' });
    return;
  }

  try {
    const token = await getAuth(app).verifyIdToken(match[1]);
    if (!allowedUids.has(token.uid)) {
      res.status(403).json({ status: 403, error: 'Forbidden' });
      return;
    }
  } catch {
    res.status(401).json({ status: 401, error: 'Authentication required' });
    return;
  }

  next();
};
