import { AbstractLevelDOWN } from 'abstract-leveldown';
import levelup, { LevelUp } from 'levelup';
import MemDownConstructor from 'memdown';

export type DB<K, V> = LevelUp<AbstractLevelDOWN<K, V>>;
export type StringDB = DB<string, string>;

// This was reporting jest as a browser....
// const isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined";
const isNode = () => typeof process === 'object' && !(process as any).browser;
const isBrowser = () => !isNode();

export function createMemDb(): StringDB {
  return levelup(MemDownConstructor<string, string>());
}

export function createBrowserDb(name: string): StringDB {
  const encode = require('encoding-down');
  const leveljs = require('level-js');
  return levelup(encode(leveljs(name)));
}

// placeholder to be read from configuration later
export const createDb = (name: string) =>
  isBrowser() ? createBrowserDb(name) : createMemDb();

export async function hasDbKey(db: StringDB, key: string): Promise<boolean> {
  try {
    await db.get(key);
    return true;
  } catch (err) {
    if (isNotFoundError(err)) {
      return false;
    }
    throw err;
  }
}

const isNotFoundError = (err: any) => err && err.notFound;
