import { Timestamp } from 'firebase/firestore';
import { BaseModel } from './base/model';

export interface Match extends BaseModel {
  roundId: string;
  nr: number;
  date: Timestamp;
  league: string;
  hometeam: string;
  awayteam: string;
  result: string;
  points: number;
}
