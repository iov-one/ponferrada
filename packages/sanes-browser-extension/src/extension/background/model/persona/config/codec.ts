import { createCosmWasmConnector, TokenConfiguration } from "@cosmwasm/bcp";
import { Algorithm, ChainConnector } from "@iov/bcp";
import { createBnsConnector } from "@iov/bns";
import { Slip10RawIndex } from "@iov/crypto";
import { createEthereumConnector } from "@iov/ethereum";
import { HdPaths } from "@iov/keycontrol";
import { createLiskConnector } from "@iov/lisk";

import { getErc20TokensConfig } from "../../../../../utils/tokens";
import { ChainSpec, CodecType } from "./configurationfile";

export function algorithmForCodec(codec: CodecType): Algorithm {
  switch (codec) {
    case CodecType.Bns:
    case CodecType.Lisk:
      return Algorithm.Ed25519;
    case CodecType.CosmWasm:
    case CodecType.Ethereum:
      return Algorithm.Secp256k1;
    default:
      throw new Error(`unsupported codec: ${codec}`);
  }
}

export function pathBuilderForCodec(codecType: CodecType): (derivation: number) => readonly Slip10RawIndex[] {
  const pathBuilder = (derivation: number): readonly Slip10RawIndex[] => {
    switch (codecType) {
      case CodecType.Bns:
        return HdPaths.iov(derivation);
      case CodecType.CosmWasm:
        return HdPaths.cosmos(derivation);
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

export function chainConnector(chainSpec: ChainSpec): ChainConnector {
  switch (chainSpec.codecType) {
    case CodecType.Bns:
      return createBnsConnector(chainSpec.node, chainSpec.chainId);
    case CodecType.CosmWasm: {
      const addressPrefix = "cosmos";
      const tokenConfig: TokenConfiguration = (chainSpec as any).tokenConfig;
      return createCosmWasmConnector(chainSpec.node, addressPrefix, tokenConfig, chainSpec.chainId);
    }
    case CodecType.Lisk:
      return createLiskConnector(chainSpec.node, chainSpec.chainId);
    case CodecType.Ethereum:
      return createEthereumConnector(
        chainSpec.node,
        {
          scraperApiUrl: chainSpec.scraper,
          erc20Tokens: chainSpec.ethereumOptions
            ? getErc20TokensConfig(chainSpec.ethereumOptions)
            : undefined,
        },
        chainSpec.chainId,
      );
    default:
      throw new Error("No connector for this codec found");
  }
}
