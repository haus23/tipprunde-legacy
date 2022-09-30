import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as signOutFromFirebase,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { app } from './app';

export const auth = getAuth(app);

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return signOutFromFirebase(auth);
}

export function updateProfile(changes: {
  displayName?: string;
  photoURL?: string;
}) {
  return updateFirebaseProfile(auth.currentUser!, changes);
}
