import { CosmWasmCodec } from "@cosmwasm/bcp";
import { ChainId, TxCodec } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { ethereumCodec } from "@iov/ethereum";
import { liskCodec } from "@iov/lisk";

import { ChainSpec, CodecType, getConfig } from "../config";

export function getCodec(spec: ChainSpec): TxCodec {
  switch (spec.codecType) {
    case CodecType.Bns:
      return bnsCodec;
    case CodecType.Ethereum:
      return ethereumCodec;
    case CodecType.Iovns: {
      // HARD-CODED values in conjunction with .../sanes-browser-extension/src/extension/background/model/persona/config/mockstar1chain.ts
      const addressPefix = "star";
      const bankToken = {
        fractionalDigits: 9,
        name: "Internet Of Value Token",
        ticker: "IOV",
        denom: "IOV",
      };
      const cosmwasmCodec = new CosmWasmCodec(addressPefix, [bankToken]);
      console.warn(`HARD-CODED values in codec.ts: ${JSON.stringify({ addressPefix, bankToken })}`);
      return cosmwasmCodec;
    }
    case CodecType.Lisk:
      return liskCodec;
    default:
      throw new Error("Unsupported codecType for chain spec");
  }
}

export async function getCodecForChainId(chainId: ChainId): Promise<TxCodec> {
  const chains = (await getConfig()).chains;
  const specificChain = chains.find(chain => chain.chainSpec.chainId === chainId);
  if (specificChain) {
    return getCodec(specificChain.chainSpec);
  }

  throw new Error("No codec found or no active connection for this chainId");
}
