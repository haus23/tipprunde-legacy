import type { User as FirebaseUser } from 'firebase/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as signOutFromFirebase,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import * as v from 'valibot';

import { authAtom } from '#/utils/state/auth';
import { store } from '#/utils/store';
import { app } from './app';

export const auth = getAuth(app);

export function initializeAuth() {
  auth.onAuthStateChanged((user) => {
    store.set(authAtom, {
      isAuthenticated: true,
      user: user === null ? null : v.parse(UserSchema, user),
    });
  });
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
  return signOutFromFirebase(auth);
}

export async function updateProfile(changes: {
  displayName?: string;
  photoURL?: string;
}) {
  await updateFirebaseProfile(auth.currentUser as FirebaseUser, changes);
  store.set(authAtom, {
    isAuthenticated: true,
    user:
      auth.currentUser === null ? null : v.parse(UserSchema, auth.currentUser),
  });
}

export const UserSchema = v.pipe(
  v.object({
    uid: v.string(),
    email: v.nullable(v.string(), ''),
    displayName: v.nullable(v.string(), ''),
    photoURL: v.nullable(v.string()),
  }),
);

export type User = v.InferOutput<typeof UserSchema>;
