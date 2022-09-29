import { BaseModel } from '@/firebase/db/base-model';
import { User } from './user';

export const ROLES = <const>['Admin', 'Manager', 'Keine'];

export type Role = typeof ROLES[number];

export interface Profile extends BaseModel, User {
  role: Role;
  playerId: string;
}
