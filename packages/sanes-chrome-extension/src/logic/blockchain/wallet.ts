import { Algorithm } from '@iov/bcp';
import { WalletId } from '@iov/core';
import { Codec } from './connection';
import { ValueAndUpdates } from '@iov/stream';
import { WalletInfo, HdPaths } from '@iov/keycontrol';
import { Slip10RawIndex } from '@iov/crypto';

export function algorithmForCodec(codec: Codec): Algorithm {
  switch (codec) {
    case Codec.Bns:
    case Codec.Lisk:
      return Algorithm.Ed25519;
    case Codec.Ethereum:
      return Algorithm.Secp256k1;
    default:
      throw new Error(`unsupported codec: ${codec}`);
  }
}

export function pathBuilderForCodec(
  codec: Codec
): (derivation: number) => ReadonlyArray<Slip10RawIndex> {
  const pathBuilder = (derivation: number): ReadonlyArray<Slip10RawIndex> => {
    switch (codec) {
      case Codec.Bns: // BNS and BOV
        return HdPaths.iov(derivation);
      case Codec.Lisk:
        return HdPaths.bip44Like(134, derivation);
      case Codec.Ethereum:
        return HdPaths.ethereum(derivation);
      default:
        throw new Error(`unsupported codec: ${codec}`);
    }
  };
  return pathBuilder;
}

export function walletFrom(
  codec: Codec,
  availableWallets: ValueAndUpdates<ReadonlyArray<WalletInfo>>
): WalletId {
  //eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const wallets = availableWallets.value.map(i => i.id);
  const [edWallet, secWallet] = wallets;
  switch (codec) {
    case Codec.Bns:
    case Codec.Lisk:
      return edWallet;
    case Codec.Ethereum:
      return secWallet;
    default:
      throw new Error(`unsupported codec: ${codec}`);
  }
}

export function pathFrom(
  codec: Codec,
  derivation: number
): ReadonlyArray<Slip10RawIndex> {
  switch (codec) {
    case Codec.Bns: // BNS and BOV
      return HdPaths.iov(derivation);
    case Codec.Lisk:
      return HdPaths.bip44Like(134, derivation);
    case Codec.Ethereum:
      return HdPaths.ethereum(derivation);
    default:
      throw new Error(`unsupported codec: ${codec}`);
  }
}
