import type { BaseModel } from './base/model';

export type Championship = BaseModel & {
  name: string;
  nr: number;
  rulesId: string;
  published: boolean;
  completed: boolean;
};
