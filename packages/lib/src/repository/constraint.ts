import { orderBy, where, WhereFilterOp } from 'firebase/firestore';

export function filter(field: string, op: WhereFilterOp, value: unknown) {
  return where(field, op, value);
}

export function orderByAsc(field: string) {
  return orderBy(field, 'asc');
}

export function orderByDesc(field: string) {
  return orderBy(field, 'desc');
}
