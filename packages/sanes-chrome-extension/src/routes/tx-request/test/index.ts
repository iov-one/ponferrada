import {
  Address,
  Algorithm,
  Amount,
  ChainId,
  PublicIdentity,
  PublicKeyBytes,
  SendTransaction,
  TokenTicker,
} from '@iov/bcp';
import { RegisterUsernameTx } from '@iov/bns';
import { Encoding } from '@iov/encoding';

export function getCashTransaction(): SendTransaction {
  const defaultCreator: PublicIdentity = {
    chainId: 'some-chain' as ChainId,
    pubkey: {
      algo: Algorithm.Ed25519,
      // Random 32 bytes pubkey. Derived IOV address:
      // tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3 / 6e1114f57410d8e7bcd910a568c9196efc1479e4
      data: Encoding.fromHex(
        '7196c465e4c95b3dce425784f51936b95da6bc58b3212648cdca64ee7198df47',
      ) as PublicKeyBytes,
    },
  };

  const defaultAmount: Amount = {
    quantity: '1000000001',
    fractionalDigits: 9,
    tokenTicker: 'CASH' as TokenTicker,
  };

  const transaction: SendTransaction = {
    kind: 'bcp/send',
    creator: defaultCreator,
    amount: defaultAmount,
    recipient: 'tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f' as Address,
    memo: 'paid transaction',
    fee: {
      tokens: defaultAmount,
    },
  };

  return transaction;
}

export function getUsernameTransaction(): RegisterUsernameTx {
  const defaultCreator: PublicIdentity = {
    chainId: 'some-chain' as ChainId,
    pubkey: {
      algo: Algorithm.Ed25519,
      // Random 32 bytes pubkey. Derived IOV address:
      // tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3 / 6e1114f57410d8e7bcd910a568c9196efc1479e4
      data: Encoding.fromHex(
        '7196c465e4c95b3dce425784f51936b95da6bc58b3212648cdca64ee7198df47',
      ) as PublicKeyBytes,
    },
  };

  const defaultAmount: Amount = {
    quantity: '1000000001',
    fractionalDigits: 9,
    tokenTicker: 'CASH' as TokenTicker,
  };

  const transaction: RegisterUsernameTx = {
    kind: 'bns/register_username',
    creator: defaultCreator,
    username: 'test',
    addresses: [
      { chainId: 'foobar' as ChainId, address: 'tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f' as Address },
    ],
    fee: {
      tokens: defaultAmount,
    },
  };

  return transaction;
}
