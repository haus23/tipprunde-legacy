import type { BaseModel } from './base/model';

export type Tip = BaseModel & {
  playerId: string;
  matchId: string;
  tip: string;
  joker: boolean;
  points: number;
  lonelyHit?: boolean;
};
