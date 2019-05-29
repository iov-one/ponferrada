import { PublicIdentity } from '@iov/bcp';
import { GetIdentitiesAuthorization, SignAndPostAuthorization, TransactionEncoder } from '@iov/core';
import { EnglishMnemonic } from '@iov/crypto';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { createMemDb } from '../db';
import { Persona, PersonaAcccount } from './persona';

withChainsDescribe('Persona', () => {
  const revealAllIdentities: GetIdentitiesAuthorization = async (
    reason,
    matchingIdentities,
  ): Promise<ReadonlyArray<PublicIdentity>> => {
    return matchingIdentities;
  };
  const signEverything: SignAndPostAuthorization = async (): Promise<boolean> => {
    return true;
  };

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

  describe('startSigningServer', () => {
    it('can start the signing server', async () => {
      const persona = await Persona.create(createMemDb(), 'passwd');
      const server = persona.startSigningServer(revealAllIdentities, signEverything);
      expect(server).toBeTruthy();
      persona.destroy();
    });

    it('can send example request to the signing server', async () => {
      const persona = await Persona.create(
        createMemDb(),
        'passwd',
        'oxygen fall sure lava energy veteran enroll frown question detail include maximum',
      );
      const server = persona.startSigningServer(revealAllIdentities, signEverything);
      const response = await server.handleChecked({
        jsonrpc: '2.0',
        id: 1,
        method: 'getIdentities',
        params: {
          reason: TransactionEncoder.toJson('I would like to know who you are on Ethereum'),
          chainIds: TransactionEncoder.toJson(['ethereum-eip155-5777']),
        },
      });
      expect(response).toEqual({
        jsonrpc: '2.0',
        id: 1,
        result: [
          {
            chainId: 'string:ethereum-eip155-5777',
            pubkey: {
              algo: 'string:secp256k1',
              data:
                'bytes:04965fb72aad79318cd8c8c975cf18fa8bcac0c091605d10e89cd5a9f7cff564b0cb0459a7c22903119f7a42947c32c1cc6a434a86f0e26aad00ca2b2aff6ba381',
            },
          },
        ],
      });
      persona.destroy();
    });
  });

  describe('tearDownSigningServer', () => {
    it('can tear down the signing server', async () => {
      const persona = await Persona.create(createMemDb(), 'passwd');

      expect(() => {
        persona.startSigningServer(revealAllIdentities, signEverything);
        persona.tearDownSigningServer();
      }).not.toThrow();

      persona.destroy();
    });
  });
});
