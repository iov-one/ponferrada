import { Algorithm } from '@iov/bcp';
import { HdPaths } from '@iov/keycontrol';
import { Slip10RawIndex } from '@iov/crypto';

import { Codec } from './connection';

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
