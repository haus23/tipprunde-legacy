import { BaseModel } from '@/firebase/db/base-model';

export interface Player extends BaseModel {
  name: string;
  email: string;
}
