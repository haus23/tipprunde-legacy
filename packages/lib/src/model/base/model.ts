import type { FieldValue } from 'firebase/firestore';

export type BaseModel = {
  id: string;
  updated_at?: FieldValue;
};
