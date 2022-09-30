export const ROLES = <const>['Admin', 'Manager', 'Keine'];

export type Role = typeof ROLES[number];

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: Role;
  playerId: string;
}
