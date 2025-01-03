import { createStorage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import memoryDriver from 'unstorage/drivers/memory';

export const storage = createStorage({
  driver:
    process.env.NODE_ENV === 'production'
      ? memoryDriver()
      : fsDriver({ base: './.cache' }),
});

storage.mount('archive', fsDriver({ base: './.cache/archive' }));
