import type { BaseModel } from './base/model';

export type Match = BaseModel & {
  roundId: string;
  nr: number;
  date: string;
  leagueId: string;
  hometeamId: string;
  awayteamId: string;
  result: string;
  points: number;
};
