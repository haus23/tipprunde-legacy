import { BaseModel } from './base/model';

export type Team = BaseModel & {
  name: string;
  shortname: string;
};
