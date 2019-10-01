import { ChainId, TxCodec } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { ethereumCodec } from "@iov/ethereum";
import { liskCodec } from "@iov/lisk";

import { ChainSpec, getConfig } from "../config";
import { isBnsSpec, isEthSpec, isLskSpec } from "./connection";

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

  throw new Error("Unsupported codecType for chain spec");
}

export async function getCodecForChainId(chainId: ChainId): Promise<TxCodec> {
  const chains = (await getConfig()).chains;
  const specificChain = chains.find(chain => chain.chainSpec.chainId === chainId);
  if (specificChain) {
    return getCodec(specificChain.chainSpec);
  }

  throw new Error("No codec found or no active connection for this chainId");
}
