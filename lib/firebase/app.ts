import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { config } from '../config';

const apps = getApps();

export const app =
  apps.length > 0
    ? apps[0]
    : initializeApp({
        credential: cert({
          ...config.firebaseSvcAccount,
        }),
      });
