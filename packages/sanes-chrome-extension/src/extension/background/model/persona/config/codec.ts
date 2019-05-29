import { Algorithm, ChainConnector } from '@iov/bcp';
import { HdPaths } from '@iov/keycontrol';
import { Slip10RawIndex } from '@iov/crypto';
import { bnsConnector } from '@iov/bns';
import { liskConnector } from '@iov/lisk';
import { ethereumConnector } from '@iov/ethereum';

import { CodecString } from './configurationfile';

export enum CodecType {
  Bns,
  Lisk,
  Ethereum,
}

export function codecTypeFromString(input: CodecString): CodecType {
  switch (input) {
    case 'bns':
      return CodecType.Bns;
    case 'lsk':
      return CodecType.Lisk;
    case 'eth':
      return CodecType.Ethereum;
    default:
      throw new Error(`Codec '${input}' not supported`);
  }
}

export function algorithmForCodec(codec: CodecType): Algorithm {
  switch (codec) {
    case CodecType.Bns:
    case CodecType.Lisk:
      return Algorithm.Ed25519;
    case CodecType.Ethereum:
      return Algorithm.Secp256k1;
    default:
      throw new Error(`unsupported codec: ${codec}`);
  }
}

export function pathBuilderForCodec(
  codecType: CodecType,
): (derivation: number) => ReadonlyArray<Slip10RawIndex> {
  const pathBuilder = (derivation: number): ReadonlyArray<Slip10RawIndex> => {
    switch (codecType) {
      case CodecType.Bns:
        return HdPaths.iov(derivation);
      case CodecType.Lisk:
        return HdPaths.bip44Like(134, derivation);
      case CodecType.Ethereum:
        return HdPaths.ethereum(derivation);
      default:
        throw new Error(`unsupported codec: ${codecType}`);
    }
  };
  return pathBuilder;
}

export function chainConnector(codec: CodecType, nodes: ReadonlyArray<string>): ChainConnector {
  const url = nodes[0];
  switch (codec) {
    case CodecType.Bns:
      return bnsConnector(url);
    case CodecType.Lisk:
      return liskConnector(url);
    case CodecType.Ethereum: {
      const scraperApiUrl = nodes[1];
      return ethereumConnector(url, { scraperApiUrl });
    }
    default:
      throw new Error('No connector for this codec found');
  }
}
