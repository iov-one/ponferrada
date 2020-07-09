import { ChainId, TxCodec } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { CosmosCodec } from "@iov/cosmos-sdk";
import { ethereumCodec } from "@iov/ethereum";
import { liskCodec } from "@iov/lisk";

import { ChainSpec, CodecType, Config, getConfig } from "../config";

export function getCodec(spec: ChainSpec, config: Config): TxCodec {
  switch (spec.codecType) {
    case CodecType.Bns:
      return bnsCodec;
    case CodecType.Ethereum:
      return ethereumCodec;
    case CodecType.Iovns: {
      const addressPrefix = config.addressPrefix;
      const tokenConfiguration = config.tokenConfiguration;

      return new CosmosCodec(addressPrefix, tokenConfiguration.bankTokens);
    }
    case CodecType.Lisk:
      return liskCodec;
    default:
      throw new Error("Unsupported codecType for chain spec");
  }
}

export async function getCodecForChainId(chainId: ChainId): Promise<TxCodec> {
  const config = await getConfig();
  const chains = config.chains;
  const specificChain = chains.find(chain => chain.chainSpec.chainId === chainId);
  if (specificChain) {
    return getCodec(specificChain.chainSpec, config);
  }

  throw new Error("No codec found or no active connection for this chainId");
}
