import { BaseModel } from '@/firebase/db/base-model';

export interface League extends BaseModel {
  name: string;
  shortname: string;
}
