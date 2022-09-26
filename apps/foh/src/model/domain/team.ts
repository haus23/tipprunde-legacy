import { BaseModel } from '@/firebase/db/base-model';

export interface Team extends BaseModel {
  name: string;
  shortname: string;
}
