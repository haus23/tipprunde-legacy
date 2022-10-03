import { Timestamp } from 'firebase/firestore';
import { BaseModel } from './base/model';

export type Match = BaseModel & {
  roundId: string;
  nr: number;
  date: Timestamp;
  league: string;
  hometeam: string;
  awayteam: string;
  result: string;
  points: number;
};
