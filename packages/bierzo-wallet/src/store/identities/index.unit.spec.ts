import { ChainId } from "@iov/bcp";

import { aNewStore } from "..";
import { getExtensionStatus } from "../../communication/extension";
import * as identities from "../../communication/identities";
import { parseGetIdentitiesResponse } from "../../communication/identities";
import { disconnect } from "../../logic/connection";
import { setIdentitiesStateAction } from "./actions";

describe("Identitites reducer", () => {
  afterAll(() => disconnect());

  it("has correct initial state", async () => {
    const store = aNewStore();
    const { identities } = store.getState();
    expect(identities).toEqual(new Map());
  });

  it("correctly performs action from setIdentitiesStateAction", async () => {
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
    store.dispatch(setIdentitiesStateAction(extension.identities));

    const expectedIdentities = new Map([["ethereum-eip155-5777" as ChainId, identitiesResponse[0]]]);

    const identitiesState = store.getState().identities;
    expect(identitiesState).toEqual(expectedIdentities);
  });
});
