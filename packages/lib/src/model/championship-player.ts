import type { BaseModel } from './base/model';

export type ChampionshipPlayer = BaseModel & {
  playerId: string;
  nr: number;
  points: number;
  extraPoints: number;
  totalPoints: number;
  rank: number;
};
