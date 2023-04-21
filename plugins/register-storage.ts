import chained from '~/lib/unstorage/drivers/chained';
import fs from 'unstorage/drivers/fs';
import memory from 'unstorage/drivers/memory';
import { config } from '~/lib/config';

export default defineNitroPlugin(async () => {
  const storage = useStorage();
  await storage.unmount('cache');
  storage.mount('cache', chained({ drivers: [memory(), fs({ base: config.unstorage.basePath })] }));
});
