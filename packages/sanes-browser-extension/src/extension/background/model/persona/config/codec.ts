import { Algorithm, ChainConnector, ChainId } from "@iov/bcp";
import { createBnsConnector } from "@iov/bns";
import { Slip10RawIndex } from "@iov/crypto";
import { createEthereumConnector } from "@iov/ethereum";
import { HdPaths } from "@iov/keycontrol";
import { createLiskConnector } from "@iov/lisk";

import { CodecString } from "./configurationfile";

export enum CodecType {
  Bns,
  Lisk,
  Ethereum,
}

export function codecTypeFromString(input: CodecString): CodecType {
  switch (input) {
    case "bns":
      return CodecType.Bns;
    case "lsk":
      return CodecType.Lisk;
    case "eth":
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

export function pathBuilderForCodec(codecType: CodecType): (derivation: number) => readonly Slip10RawIndex[] {
  const pathBuilder = (derivation: number): readonly Slip10RawIndex[] => {
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

export function chainConnector(
  codec: CodecType,
  nodeUrl: string,
  scraper: string | undefined,
): ChainConnector {
  const expectedBnsChainId: ChainId | undefined = undefined;
  const expectedLiskChainId: ChainId | undefined = undefined;
  const expectedEthereumChainId: ChainId | undefined = undefined;

  switch (codec) {
    case CodecType.Bns:
      return createBnsConnector(nodeUrl, expectedBnsChainId);
    case CodecType.Lisk:
      return createLiskConnector(nodeUrl, expectedLiskChainId);
    case CodecType.Ethereum:
      return createEthereumConnector(nodeUrl, { scraperApiUrl: scraper }, expectedEthereumChainId);
    default:
      throw new Error("No connector for this codec found");
  }
}
