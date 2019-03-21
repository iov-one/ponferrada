import { AbstractLevelDOWN } from 'abstract-leveldown';
import levelup, { LevelUp } from 'levelup';
import leveldown from 'leveldown';

export type DB<K, V> = LevelUp<AbstractLevelDOWN<K, V>>;
export type StringDB = DB<string, string>;

// This was reporting jest as a browser....
// const isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined";
const isNode = (): boolean =>
  typeof process === 'object' && !(process as NodeJS.process).browser;
const isBrowser = (): boolean => !isNode();

export function createMemDb(name: strig): StringDB {
  return levelup(leveldown('memdb/' + name));
}

export function createBrowserDb(name: string): StringDB {
  const encode = require('encoding-down');
  const leveljs = require('level-js');
  return levelup(encode(leveljs(name)));
}

// placeholder to be read from configuration later
export const createDb = (name: string): DB<K, V> =>
  isBrowser() ? createBrowserDb(name) : createMemDb(name);

const isNotFoundError = (err: any): boolean => err && err.notFound;

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
