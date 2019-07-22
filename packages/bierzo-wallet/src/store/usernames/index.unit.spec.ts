import { Address, ChainId } from '@iov/bcp';

import { parseGetIdentitiesResponse } from '../../communication/identities';
import * as identities from '../../communication/identities';
import { disconnect } from '../../logic/connection';
import { aNewStore } from '../../store';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { getExtensionStatus, setExtensionStateAction } from '../extension';
import { addUsernamesAction, getUsernames } from './actions';
import { BwUsername } from './reducer';

withChainsDescribe('Usernames reducer', () => {
  afterAll(async () => {
    await disconnect();
  });

  it('has correct initial state', async () => {
    const store = aNewStore();
    const usernames = store.getState().usernames;
    expect(usernames).toEqual([]);
  });

  it('returns empty when no keys passed to getUsernames function', async () => {
    const usernames = await getUsernames({});
    expect(usernames).toEqual([]);
  });

  it('returns empty when no key bns identity key is s passed to getUsernames function', async () => {
    const store = aNewStore();
    const ethResponse = {
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
    };

    const identitiesResponse = parseGetIdentitiesResponse(ethResponse);
    jest.spyOn(identities, 'sendGetIdentitiesRequest').mockResolvedValueOnce(identitiesResponse);

    const extension = await getExtensionStatus();
    store.dispatch(setExtensionStateAction(extension.connected, extension.installed, extension.keys));

    const keys = store.getState().extension.keys;
    const usernames = await getUsernames(keys);
    expect(usernames).toEqual([]);
  });

  describe('usernamesReducer', () => {
    it('can add usernames', () => {
      const usernamesToAdd: BwUsername[] = [
        {
          username: 'foobar',
          addresses: [],
        },
      ];

      const store = aNewStore();
      expect(store.getState().usernames).toEqual([]);
      store.dispatch(addUsernamesAction(usernamesToAdd));
      expect(store.getState().usernames).toEqual(usernamesToAdd);
    });

    it('overrides existing entries', () => {
      const usernamesToAdd1: BwUsername[] = [
        {
          username: 'foobar',
          addresses: [],
        },
      ];
      const usernamesToAdd2: BwUsername[] = [
        {
          username: 'foobar',
          addresses: [
            {
              address: 'aabbccdd' as Address,
              chainId: 'some-chain' as ChainId,
            },
          ],
        },
      ];

      const store = aNewStore();
      store.dispatch(addUsernamesAction(usernamesToAdd1));
      store.dispatch(addUsernamesAction(usernamesToAdd2));
      expect(store.getState().usernames).toEqual(usernamesToAdd2);
    });

    it('overrides keeps existing entries alive', () => {
      const usernamesToAdd1: BwUsername[] = [
        {
          username: 'foobar1',
          addresses: [],
        },
      ];
      const usernamesToAdd2: BwUsername[] = [
        {
          username: 'foobar2',
          addresses: [],
        },
      ];

      const store = aNewStore();
      store.dispatch(addUsernamesAction(usernamesToAdd1));
      store.dispatch(addUsernamesAction(usernamesToAdd2));
      expect(store.getState().usernames).toEqual([...usernamesToAdd1, ...usernamesToAdd2]);
    });
  });

  it('dispatches correctly addUsernames action', async () => {
    const store = aNewStore();
    const ethResponse = {
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
    };

    const identitiesResponse = parseGetIdentitiesResponse(ethResponse);
    jest.spyOn(identities, 'sendGetIdentitiesRequest').mockResolvedValueOnce(identitiesResponse);

    const extension = await getExtensionStatus();
    store.dispatch(setExtensionStateAction(extension.connected, extension.installed, extension.keys));

    const keys = store.getState().extension.keys;
    const emptyChainUsernames = await getUsernames({});
    store.dispatch(addUsernamesAction(emptyChainUsernames));

    const chainUsernames = await getUsernames(keys);
    store.dispatch(addUsernamesAction(chainUsernames));

    const usernames = store.getState().usernames;
    expect(usernames).toEqual([]);
  });
});
