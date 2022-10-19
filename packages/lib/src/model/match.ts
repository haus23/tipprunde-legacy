import { Timestamp } from 'firebase/firestore';
import { BaseModel } from './base/model';

export type Match = BaseModel & {
  roundId: string;
  nr: number;
  date: Timestamp;
  leagueId: string;
  hometeamId: string;
  awayteamId: string;
  result: string;
  points: number;
};
