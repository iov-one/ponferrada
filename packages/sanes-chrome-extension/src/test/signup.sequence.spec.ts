import { randomString } from './helpers';
import * as db from '../logic/db';
import { loadOrCreateProfile } from '../logic/core/profile';

describe('signup', () => {
  describe('user', () => {
    it('should create a new db named like username', () => {
      const username = randomString(8);
      const username2 = randomString(8);
      const dbLocal = db.createDb(username);
      console.log('dbLocal', dbLocal._db.location);
      expect(dbLocal._db.location).toContain(username);
      expect(dbLocal._db.location).not.toContain(username2);
    });
    xit('should return error when username exists', () => {
      const username = randomString(8);
      db.createDb(username);
      db.createDb(username);
      // FIXME: how to detect error here?
      expect(db.createDb(username)).throw(/already held by process/);
    });
    it('should create 2 dbs based on different usernames', async () => {
      const username1 = randomString(8);
      const username2 = randomString(8);
      const dbLocal1 = db.createDb(username1);
      const dbLocal2 = db.createDb(username2);
      expect(dbLocal1._db.location).toContain(username1);
      expect(dbLocal2._db.location).toContain(username2);
      expect(dbLocal1._db.location).not.toEqual(dbLocal2._db.location);
    });
  });

  describe('profile', () => {
    it('should create a new db based on username with a profile', async () => {
      const username = randomString(8);
      const password = randomString(16);
      const dbLocal = db.createDb(username);
      const profile = await loadOrCreateProfile(dbLocal, password);
      expect(profile).toBeDefined();
      expect(profile.wallets.value.length).toBeGreaterThan(1);
    });
    it('should return error when try to access to profile with different password', async () => {
      const username = randomString(8);
      const password = randomString(16);
      const password2 = randomString(16);
      const dbLocal = db.createDb(username);
      const profile = await loadOrCreateProfile(dbLocal, password);
      expect(profile).toBeDefined();
      expect(profile.wallets.value.length).toBeGreaterThan(1);
      try {
        await loadOrCreateProfile(dbLocal, password2);
      } catch (err) {
        expect(err.toString()).toContain('invalid usage');
      }
    });
  });
});
