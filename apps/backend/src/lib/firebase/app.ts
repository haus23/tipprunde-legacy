import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { env } from '#app/env.ts';

const apps = getApps();

export const app =
  apps.length > 0
    ? apps[0]
    : initializeApp({
        credential: cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY,
        }),
      });
