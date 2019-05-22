import { AbstractLevelDOWN } from 'abstract-leveldown';
import levelup, { LevelUp } from 'levelup';
import MemDownConstructor from 'memdown';

/** An alias for the type used in the UserProfile interface */
export type StringDb = LevelUp<AbstractLevelDOWN<string, string>>;

export function createMemDb(): StringDb {
  return levelup(MemDownConstructor<string, string>());
}
