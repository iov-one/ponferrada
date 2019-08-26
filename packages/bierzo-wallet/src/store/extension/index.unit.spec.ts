import { Algorithm, ChainId, Identity, PubkeyBytes } from "@iov/bcp";
import { Encoding } from "@iov/encoding";

import * as identities from "../../communication/identities";
import { parseGetIdentitiesResponse } from "../../communication/identities";
import { disconnect } from "../../logic/connection";
import { aNewStore } from "../../store";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { getExtensionStatus, groupIdentitiesByChain, setExtensionStateAction } from "./actions";

withChainsDescribe("Extension reducer", () => {
  afterAll(() => disconnect());

  it("has correct initial state", async () => {
    const store = aNewStore();
    const extension = store.getState().extension;
    expect(extension).toEqual({
      connected: false,
      installed: false,
      identities: {},
    });
  });

  it("dispatches correctly setExtensionStateAction action", async () => {
    const store = aNewStore();
    const ethResponse = {
      jsonrpc: "2.0",
      id: 1,
      result: [
        {
          chainId: "string:ethereum-eip155-5777",
          pubkey: {
            algo: "string:secp256k1",
            data:
              "bytes:04965fb72aad79318cd8c8c975cf18fa8bcac0c091605d10e89cd5a9f7cff564b0cb0459a7c22903119f7a42947c32c1cc6a434a86f0e26aad00ca2b2aff6ba381",
          },
        },
      ],
    };

    const identitiesResponse = parseGetIdentitiesResponse(ethResponse);
    jest.spyOn(identities, "sendGetIdentitiesRequest").mockResolvedValueOnce(identitiesResponse);

    const extension = await getExtensionStatus();
    store.dispatch(setExtensionStateAction(extension.connected, extension.installed, extension.identities));

    const extensionState = store.getState().extension;
    expect(extensionState.connected).toBeTruthy();
    expect(extensionState.installed).toBeTruthy();
    expect(extensionState.identities).toBe(identitiesResponse);
  });
});

describe("groupIdentitiesByChain", () => {
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
    expect(groupIdentitiesByChain([])).toEqual({});
  });

  it("works for a single identity", () => {
    expect(groupIdentitiesByChain([ethIdentity1])).toEqual({
      "ethtest-1234": ethIdentity1,
    });
  });

  it("works for multiple chains", () => {
    expect(groupIdentitiesByChain([ethIdentity1, iovIdentity1])).toEqual({
      "ethtest-1234": ethIdentity1,
      "iovtest-1234": iovIdentity1,
    });
  });

  it("returns first identity for each chain", () => {
    expect(groupIdentitiesByChain([ethIdentity1, ethIdentity2])).toEqual({
      "ethtest-1234": ethIdentity1,
    });
  });
});
