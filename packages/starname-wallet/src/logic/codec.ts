import { CosmosCodec } from "@iov/cosmos-sdk";
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
    case CodecType.Cosmos:
      const defaultBankTokens = [
        {
          fractionalDigits: 6,
          ticker: "IOV",
          denom: "uiov",
        },
      ];
      return new CosmosCodec("star1", defaultBankTokens);
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
