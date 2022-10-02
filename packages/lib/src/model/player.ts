import { BaseModel } from './base/model';

export interface Player extends BaseModel {
  name: string;
  email: string;
}
