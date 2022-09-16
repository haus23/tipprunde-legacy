import { User } from './user';

export type Role = 'Admin' | 'Manager' | 'Player';

export interface Profile extends User {
  role: Role;
  playerId: string;
}
