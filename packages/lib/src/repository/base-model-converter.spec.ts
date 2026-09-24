import { expect, it } from 'vitest';

import { baseModelConverter } from './base-model-converter';

it('drops a legacy update timestamp when reading a document', () => {
  const converter = baseModelConverter<{ id: string; name: string }>();
  const snapshot = {
    id: 'team-id',
    data: () => ({
      name: 'Team',
      updated_at: { seconds: 1, nanoseconds: 0 },
    }),
  };

  const model = converter.fromFirestore(snapshot as never, {});

  expect(model).toEqual({ id: 'team-id', name: 'Team' });
});
