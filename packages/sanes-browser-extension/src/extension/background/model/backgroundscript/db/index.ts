import { AbstractLevelDOWN } from "abstract-leveldown";
import levelup, { LevelUp } from "levelup";
import MemDownConstructor from "memdown";

/** An alias for the type used in the UserProfile interface */
export type StringDb = LevelUp<AbstractLevelDOWN<string, string>>;

export class Db {
  private static createMemDb(): StringDb {
    return levelup(MemDownConstructor<string, string>());
  }

  private static createBrowserDb(name: string): StringDb {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const leveljs = require("level-js");
    return levelup(leveljs(name));
  }

  private db: StringDb =
    process.env.NODE_ENV === "test" ? Db.createMemDb() : Db.createBrowserDb("bs-persona");

  public async clear(): Promise<void> {
    const db = this.db;
    const keysToClear = new Array<string>();
    return new Promise((resolve, reject) => {
      db.createKeyStream({ keyAsBuffer: false })
        .on("data", key => {
          if (typeof key !== "string") {
            reject("Got key of type other than string");
            return;
          }
          keysToClear.push(key);
        })
        .on("error", (error: any) => reject(error))
        .on("close", async () => {
          for (const key of keysToClear) {
            await db.del(key);
          }
          resolve();
        });
    });
  }

  public async hasPersona(): Promise<boolean> {
    // Constant from IOV-Core source code. Would be good to have a proper API for that
    const storageKeyFormatVersion = "format_version";

    try {
      await this.db.get(storageKeyFormatVersion);
      return true;
    } catch (_) {
      return false;
    }
  }

  public getDb(): StringDb {
    return this.db;
  }
}
