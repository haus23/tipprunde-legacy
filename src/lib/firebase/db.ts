import { getFirestore } from 'firebase-admin/firestore';
import { app } from './app.ts';

export const db = getFirestore(app);
