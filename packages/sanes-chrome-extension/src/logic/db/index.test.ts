import { createDb, createMemDb, hasDbKey } from './index';

describe('createMemDb', () => {
  const demoKey = 'demo';

  it('returns an empty db', async () => {
    const db = createMemDb();
    expect(await hasDbKey(db, demoKey)).toBe(false);
  });

  it('returns a fresh copy each time', async () => {
    const db = createMemDb();
    db.put(demoKey, 'foo');

    const db2 = createMemDb();

    expect(await hasDbKey(db, demoKey)).toBe(true);
    expect(await hasDbKey(db2, demoKey)).toBe(false);
  });
});

describe('createDb', () => {
  it('returns a test in test-cases', async () => {
    const demoKey = 'demo';
    const dbName = 'mydb';

    const db = createDb(dbName);
    db.put(demoKey, 'foo');

    const db2 = createDb(dbName);

    expect(await hasDbKey(db, demoKey)).toBe(true);
    expect(await hasDbKey(db2, demoKey)).toBe(false);
  });
});

describe('hasDbKey', () => {
  const demoKey = 'dbKey';

  it('returns if key is present', async () => {
    const db = createMemDb();
    expect(await hasDbKey(db, demoKey)).toBe(false);
    db.put(demoKey, 'foo');
    expect(await hasDbKey(db, demoKey)).toBe(true);
  });

  it('throws error on bad db', async () => {
    const badDb: any = null;
    return expect(hasDbKey(badDb, demoKey)).rejects.toThrow();
  });
});
