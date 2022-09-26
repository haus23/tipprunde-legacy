import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as signOutFromFirebase,
} from 'firebase/auth';
import { app } from './app';

export const auth = getAuth(app);

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return signOutFromFirebase(auth);
}
