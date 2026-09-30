import type { User as FirebaseUser } from 'firebase/auth';
import {
  browserLocalPersistence,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut as signOutFromFirebase,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { app } from './app';

export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: undefined,
});

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
  return updateFirebaseProfile(auth.currentUser as FirebaseUser, changes);
}

export type Profile = Pick<
  FirebaseUser,
  'uid' | 'email' | 'displayName' | 'photoURL'
>;
