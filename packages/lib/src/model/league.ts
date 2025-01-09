import { BaseModel } from './base/model';

export type League = BaseModel & {
  name: string;
  shortname: string;
};
