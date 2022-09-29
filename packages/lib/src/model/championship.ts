import { BaseModel } from './base/model';

export interface Championship extends BaseModel {
  name: string;
  nr: number;
  rulesId: string;
  published: boolean;
  completed: boolean;
}
