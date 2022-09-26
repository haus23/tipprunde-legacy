import { User as FirebaseUser } from 'firebase/auth';
export type User = Pick<
  FirebaseUser,
  'uid' | 'email' | 'displayName' | 'photoURL'
>;
