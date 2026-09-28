import { RoundSchema } from '@haus23/tipprunde-model';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { expect, it } from 'vitest';

import { modelConverter } from '#app/lib/firebase/model-converter.ts';

function snapshot(
  id: string,
  path: string,
  data: Record<string, unknown>,
): QueryDocumentSnapshot {
  return {
    id,
    ref: { path },
    data: () => data,
  } as QueryDocumentSnapshot;
}

it('validates and normalizes a Firestore document', () => {
  const converter = modelConverter(RoundSchema);
  const document = snapshot(
    'round-id',
    'championships/hr2627/rounds/round-id',
    {
      nr: 1,
      updatedAt: 'legacy value',
    },
  );

  expect(converter.fromFirestore(document)).toEqual({
    id: 'round-id',
    nr: 1,
    isDoubleRound: false,
  });
});

it('adds the Firestore path to validation errors', () => {
  const converter = modelConverter(RoundSchema);
  const document = snapshot(
    'round-id',
    'championships/hr2627/rounds/round-id',
    {
      nr: 0,
    },
  );

  expect(() => converter.fromFirestore(document)).toThrow(
    'Invalid Firestore document "championships/hr2627/rounds/round-id"',
  );
});
