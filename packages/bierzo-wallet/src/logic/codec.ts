import { CosmWasmCodec } from "@cosmwasm/bcp";
import { ChainId, TxCodec } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { ethereumCodec } from "@iov/ethereum";
import { liskCodec } from "@iov/lisk";

import { ChainSpec, CodecType, getConfig } from "../config";

/**
 * We do lazy loading to ensure the same instance is used for every getCodec() call
 * which is required to avoid re-render loops of UI components
 */
let cosmwasmCodec: CosmWasmCodec | undefined;

export function getCodec(spec: ChainSpec): TxCodec {
  switch (spec.codecType) {
    case CodecType.Bns:
      return bnsCodec;
    case CodecType.CosmWasm:
      if (!cosmwasmCodec) {
        const addressPefix = "cosmos";
        const tokenConfig = spec.tokenConfig;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        cosmwasmCodec = new CosmWasmCodec(addressPefix, tokenConfig!.bankTokens, tokenConfig!.erc20Tokens);
      }
      return cosmwasmCodec;
    case CodecType.Ethereum:
      return ethereumCodec;
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
