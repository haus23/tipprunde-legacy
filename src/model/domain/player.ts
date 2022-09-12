import { BaseModel } from './base-model';

export interface Player extends BaseModel {
  name: string;
  slug: string;
  email: string;
}
