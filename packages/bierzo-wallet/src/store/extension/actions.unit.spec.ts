import { Algorithm, ChainId, Identity, PubkeyBytes } from '@iov/bcp';
import { Encoding } from '@iov/encoding';

import { groupIdentitiesByChain } from './actions';

describe('groupIdentitiesByChain', () => {
  const ethIdentity1: Identity = {
    chainId: 'ethtest-1234' as ChainId,
    pubkey: {
      algo: Algorithm.Secp256k1,
      data: Encoding.fromHex('aabbcc') as PubkeyBytes,
    },
  };

  const ethIdentity2: Identity = {
    chainId: 'ethtest-1234' as ChainId,
    pubkey: {
      algo: Algorithm.Secp256k1,
      data: Encoding.fromHex('ddeeff') as PubkeyBytes,
    },
  };

  const iovIdentity1: Identity = {
    chainId: 'iovtest-1234' as ChainId,
    pubkey: {
      algo: Algorithm.Ed25519,
      data: Encoding.fromHex('ddeeff') as PubkeyBytes,
    },
  };

  it('works for an empty list', () => {
    expect(groupIdentitiesByChain([])).toEqual({});
  });

  it('works for a single identity', () => {
    expect(groupIdentitiesByChain([ethIdentity1])).toEqual({
      'ethtest-1234': ethIdentity1,
    });
  });

  it('works for multiple chains', () => {
    expect(groupIdentitiesByChain([ethIdentity1, iovIdentity1])).toEqual({
      'ethtest-1234': ethIdentity1,
      'iovtest-1234': iovIdentity1,
    });
  });

  it('returns last identity for each chain', () => {
    expect(groupIdentitiesByChain([ethIdentity1, ethIdentity2])).toEqual({
      'ethtest-1234': ethIdentity2,
    });
  });
});
