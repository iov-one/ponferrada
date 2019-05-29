import { EnglishMnemonic } from '@iov/crypto';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { createMemDb } from '../db';
import { Persona, PersonaAcccount } from './persona';

withChainsDescribe('Persona', () => {
  describe('create', () => {
    it('can be created', async () => {
      const persona = await Persona.create(createMemDb(), 'passwd');
      expect(persona).toBeTruthy();
      persona.destroy();
    });
  });

  describe('load', () => {
    it('can be loaded from database', async () => {
      const db = createMemDb();

      let originalMnemonic: string;
      let originalAccounts: readonly PersonaAcccount[];

      {
        const originalPersona = await Persona.create(db, 'passwd');
        originalMnemonic = originalPersona.mnemonic;
        originalAccounts = await originalPersona.getAccounts();
        originalPersona.destroy();
      }

      {
        const loadedPersona = await Persona.load(db, 'passwd');
        expect(loadedPersona.mnemonic).toEqual(originalMnemonic);
        expect(await loadedPersona.getAccounts()).toEqual(originalAccounts);
        loadedPersona.destroy();
      }
    });

    it('saves additional accounts to the database automatically', async () => {
      const db = createMemDb();

      let originalAccounts: readonly PersonaAcccount[];

      {
        const originalPersona = await Persona.create(db, 'passwd');
        await originalPersona.createAccount();
        originalAccounts = await originalPersona.getAccounts();
        originalPersona.destroy();
      }

      {
        const loadedPersona = await Persona.load(db, 'passwd');
        expect(await loadedPersona.getAccounts()).toEqual(originalAccounts);
        loadedPersona.destroy();
      }
    }, 15000); // Reset to default timeout after https://github.com/iov-one/iov-core/issues/898
  });

  describe('mnemonic', () => {
    it('returns a mnemonic', async () => {
      const persona = await Persona.create(createMemDb(), 'passwd');

      expect(() => {
        // this constructor throws when the mnemonic string is not valid
        new EnglishMnemonic(persona.mnemonic);
      }).not.toThrow();

      persona.destroy();
    });

    it('returns the right mnemonic', async () => {
      const presetMnemonic = 'until apple post diamond casual bridge bird solid inform size prize debris';
      const persona = await Persona.create(createMemDb(), 'passwd', presetMnemonic);

      expect(persona.mnemonic).toEqual(presetMnemonic);

      persona.destroy();
    });
  });

  describe('getAccounts', () => {
    it('can get accounts', async () => {
      const persona = await Persona.create(createMemDb(), 'passwd');

      const accounts = await persona.getAccounts();
      expect(accounts.length).toEqual(1);
      expect(accounts[0].label).toEqual('Account 0');

      persona.destroy();
    });
  });

  describe('createAccount', () => {
    it('can create an account', async () => {
      const persona = await Persona.create(createMemDb(), 'passwd');

      {
        const accounts = await persona.getAccounts();
        expect(accounts.length).toEqual(1); // first account created by default
      }

      await persona.createAccount();

      {
        const accounts = await persona.getAccounts();
        expect(accounts.length).toEqual(2);
        expect(accounts[0].label).toEqual('Account 0');
        expect(accounts[1].label).toEqual('Account 1');
      }

      persona.destroy();
    }, 15000); // Reset to default timeout after https://github.com/iov-one/iov-core/issues/898
  });
});
