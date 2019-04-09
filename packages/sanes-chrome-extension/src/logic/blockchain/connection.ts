import { bnsConnector } from '@iov/bns';
import { ethereumConnector } from '@iov/ethereum';
import { liskConnector } from '@iov/lisk';
import { ChainConnector } from '@iov/bcp';

export enum Codec {
  Bns,
  Lisk,
  Ethereum,
}

export type CodecType = 'bns' | 'bov' | 'lsk' | 'eth';
export function codecFromString(input: CodecType): Codec {
  switch (input) {
    case 'bns':
    case 'bov':
      return Codec.Bns;
    case 'lsk':
      return Codec.Lisk;
    case 'eth':
      return Codec.Ethereum;
    default:
      throw new Error(`Codec '${input}' not supported`);
  }
}

export function chainConnector(
  codec: Codec,
  nodes: ReadonlyArray<string>
): ChainConnector {
  const url = nodes[0];
  switch (codec) {
    case Codec.Bns:
      return bnsConnector(url);
    case Codec.Lisk:
      return liskConnector(url);
    case Codec.Ethereum:
      const scraperApiUrl = nodes[1];
      return ethereumConnector(url, { scraperApiUrl });
    default:
      throw new Error('No connector for this codec found');
  }
}

export function codecDefaultFractionalDigits(codec: Codec): number {
  switch (codec) {
    case Codec.Bns:
      return 9; // fixed for all weave tokens
    case Codec.Lisk:
      return 8;
    case Codec.Ethereum:
      return 18;
    default:
      throw new Error('Unknown codec');
  }
}
