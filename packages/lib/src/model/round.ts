import { BaseModel } from './base/model';

export interface Round extends BaseModel {
  id: string;
  nr: number;
  published: boolean;
  completed: boolean;
  tipsPublished: boolean;
}
