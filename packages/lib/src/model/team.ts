import { BaseModel } from './base/model';

export interface Team extends BaseModel {
  name: string;
  shortname: string;
}
