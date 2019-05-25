import { AbstractLevelDOWN } from 'abstract-leveldown';
import levelup, { LevelUp } from 'levelup';
import MemDownConstructor from 'memdown';

/** An alias for the type used in the UserProfile interface */
export type StringDb = LevelUp<AbstractLevelDOWN<string, string>>;

export function createMemDb(): StringDb {
  return levelup(MemDownConstructor<string, string>());
}

export function createBrowserDb(name: string): StringDb {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const leveljs = require('level-js');
  return levelup(leveljs(name));
}
