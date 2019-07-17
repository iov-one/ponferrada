import { TxCodec } from '@iov/bcp';
import { bnsCodec } from '@iov/bns';
import { ethereumCodec } from '@iov/ethereum';
import { liskCodec } from '@iov/lisk';

import { ChainSpec } from '../config';
import { isBnsSpec, isEthSpec, isLskSpec } from './connection';

export function getCodec(spec: ChainSpec): TxCodec {
  if (isEthSpec(spec)) {
    return ethereumCodec;
  }

  if (isBnsSpec(spec)) {
    return bnsCodec;
  }

  if (isLskSpec(spec)) {
    return liskCodec;
  }

  throw new Error('Unsupported codecType for chain spec');
}
