import { ChainId, TxCodec } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { ethereumCodec } from "@iov/ethereum";
import { liskCodec } from "@iov/lisk";

import { ChainSpec, getConfig } from "../config";
import { getConnectionFor, isBnsSpec, isEthSpec, isLskSpec } from "./connection";

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
  for (const chain of getConfig().chains) {
    const connection = await getConnectionFor(chain.chainSpec);
    if (connection && connection.chainId() === chainId) {
      return getCodec(chain.chainSpec);
    }
  }
  throw new Error("No codec found for this chainId");
}
