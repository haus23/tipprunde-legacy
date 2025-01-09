import { BaseModel } from './base/model';

export type Player = BaseModel & {
  name: string;
  email: string;
};
