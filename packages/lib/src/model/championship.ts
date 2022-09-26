import { BaseModel } from './base/model';

export interface Championship extends BaseModel {
  title: string;
  nr: number;
  rulesetId: string;
  published: boolean;
  completed: boolean;
}
