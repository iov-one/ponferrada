import { JsonRpcSigningServer, SignAndPostAuthorization, TransactionEncoder } from '@iov/multichain';

import { withChainsDescribe } from '../../../../utils/test/testExecutor';
import * as txsUpdater from '../../updaters/appUpdater';
import { Db, StringDb } from '../backgroundscript/db';
import { Persona } from '../persona';
import SigningServer from './index';

jest.mock('./index', () =>
  jest.fn().mockImplementation(() => {
    const revealAllIdentities = (): any => async (reason: any, matchingIdentities: any) => {
      return matchingIdentities;
    };

    const signEverything: SignAndPostAuthorization = async (): Promise<boolean> => {
      return true;
    };

    return {
      getIdentitiesCallback: revealAllIdentities,
      signAndPostCallback: signEverything,
    };
  }),
);

withChainsDescribe('background script start signing server', () => {
  let db: StringDb;

  beforeAll(() => {
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockImplementation(() => {});
    jest.spyOn(txsUpdater, 'updateRequestProvider').mockImplementation(() => {});
  });
  beforeEach(async () => {
    localStorage.clear();
    db = new Db().getDb();
  });
  afterEach(() => {
    db.close();
  });
  afterAll(() => {
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockReset();
    jest.spyOn(txsUpdater, 'updateRequestProvider').mockReset();
  });

  describe('startSigningServer', () => {
    it('can start the signing server', async () => {
      const signingServer = new SigningServer();
      const persona = await Persona.create(db, signingServer, 'test-password', undefined);
      const server = new JsonRpcSigningServer(persona.getCore());
      expect(server).toBeTruthy();
      persona.destroy();
      server.shutdown();
    });

    it('can send example request to the signing server', async () => {
      const signingServer = new SigningServer();
      const persona = await Persona.create(
        db,
        signingServer,
        'test-password',
        'oxygen fall sure lava energy veteran enroll frown question detail include maximum',
      );

      const server = new JsonRpcSigningServer(persona.getCore());
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
      server.shutdown();
    });
  });

  describe('tearDownSigningServer', () => {
    it('can tear down the signing server', async () => {
      const signingServer = new SigningServer();
      const persona = await Persona.create(db, signingServer, 'test-password');

      expect(() => {
        const server = new JsonRpcSigningServer(persona.getCore());
        server.shutdown();
        persona.destroy();
      }).not.toThrow();
    });
  });
});
