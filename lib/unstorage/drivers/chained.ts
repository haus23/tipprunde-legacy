import { Driver, defineDriver, normalizeKey } from 'unstorage';

export interface ChainedStorageOptions {
  drivers: Driver[];
}

export default defineDriver((options: ChainedStorageOptions = { drivers: [] }) => ({
  name: 'chained',
  options: options,
  async hasItem(key) {
    for (const driver of options.drivers) {
      if (await driver.hasItem(key)) {
        return true;
      }
    }
    return false;
  },
  async getItem(key) {
    const driversWithMissingKey: Driver[] = [];
    for (const driver of options.drivers) {
      const value = await driver.getItem(key);
      if (value !== null) {
        await Promise.all(
          driversWithMissingKey.map(async (driver) => {
            if (driver.setItem) {
              await driver.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            }
          })
        );
        return value;
      } else {
        driversWithMissingKey.push(driver);
      }
    }
    return null;
  },
  async setItem(key, value) {
    await Promise.all(
      options.drivers.map(async (driver) => {
        if (driver.setItem) {
          await driver.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
      })
    );
  },
  async removeItem(key) {
    await Promise.all(
      options.drivers.map(async (driver) => {
        if (driver.removeItem) {
          await driver.removeItem(key);
        }
      })
    );
  },
  async getKeys(base) {
    const allKeys = await Promise.all(
      options.drivers.map(async (driver) => {
        const keys = await driver.getKeys(base);
        return keys.map((key) => normalizeKey(key));
      })
    );
    const uniqueKeys = Array.from(new Set(allKeys.flat()));
    return uniqueKeys;
  },
  async dispose() {
    await Promise.all(
      options.drivers.map(async (driver) => {
        if (driver.dispose) {
          await driver.dispose();
        }
      })
    );
  },
}));
