import { Identity } from "@iov/bcp";

import * as identities from "../../communication/identities";
import { parseGetIdentitiesResponse } from "../../communication/identities";
import { disconnect } from "../../logic/connection";
import { aNewStore } from "../../store";
import { getExtensionStatus, setExtensionStateAction } from "./actions";

describe("Extension reducer", () => {
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

    const extensionIdentities: { [chain: string]: Identity } = {
      "ethereum-eip155-5777": identitiesResponse[0],
    };

    const extensionState = store.getState().extension;
    expect(extensionState.connected).toBeTruthy();
    expect(extensionState.installed).toBeTruthy();
    expect(extensionState.identities).toEqual(extensionIdentities);
  });
});
