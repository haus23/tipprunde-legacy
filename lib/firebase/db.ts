import { getFirestore } from 'firebase-admin/firestore';
import { app } from './app';

export const db = getFirestore(app);
