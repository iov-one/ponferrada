import { Algorithm, ChainId, Identity, PubkeyBytes } from "@iov/bcp";
import { Encoding } from "@iov/encoding";

import { chooseFirstIdentitiesByChain } from "./extension";

describe("chooseFirstIdentitiesByChain", () => {
  const ethIdentity1: Identity = {
    chainId: "ethtest-1234" as ChainId,
    pubkey: {
      algo: Algorithm.Secp256k1,
      data: Encoding.fromHex("aabbcc") as PubkeyBytes,
    },
  };

  const ethIdentity2: Identity = {
    chainId: "ethtest-1234" as ChainId,
    pubkey: {
      algo: Algorithm.Secp256k1,
      data: Encoding.fromHex("ddeeff") as PubkeyBytes,
    },
  };

  const iovIdentity1: Identity = {
    chainId: "iovtest-1234" as ChainId,
    pubkey: {
      algo: Algorithm.Ed25519,
      data: Encoding.fromHex("ddeeff") as PubkeyBytes,
    },
  };

  it("works for an empty list", () => {
    expect(chooseFirstIdentitiesByChain([])).toEqual([]);
  });

  it("works for a single identity", () => {
    expect(chooseFirstIdentitiesByChain([ethIdentity1])).toEqual([ethIdentity1]);
  });

  it("works for multiple chains", () => {
    expect(chooseFirstIdentitiesByChain([ethIdentity1, iovIdentity1])).toEqual([ethIdentity1, iovIdentity1]);
  });

  it("returns first identity for each chain", () => {
    expect(chooseFirstIdentitiesByChain([ethIdentity1, ethIdentity2])).toEqual([ethIdentity1]);
  });
});
