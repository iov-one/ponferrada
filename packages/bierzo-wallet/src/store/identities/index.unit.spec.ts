import { Address, Algorithm, ChainId, PubkeyBytes } from "@iov/bcp";
import { Encoding } from "@iov/encoding";

import { aNewStore } from "..";
import { disconnect } from "../../logic/connection";
import { setIdentities } from "./actions";
import { ExtendedIdentity, IdentitiesState } from "./reducer";

describe("Identitites reducer", () => {
  afterAll(() => disconnect());

  it("has correct initial state", async () => {
    const store = aNewStore();
    const { identities } = store.getState();
    expect(identities).toEqual(new Map());
  });

  it("correctly performs action from setIdentitiesStateAction", async () => {
    const store = aNewStore();

    const newState: IdentitiesState = new Map<ChainId, ExtendedIdentity>([
      [
        "ethereum-eip155-5777" as ChainId,
        {
          identity: {
            chainId: "ethereum-eip155-5777" as ChainId,
            pubkey: {
              algo: Algorithm.Secp256k1,
              data: Encoding.fromHex(
                "04965fb72aad79318cd8c8c975cf18fa8bcac0c091605d10e89cd5a9f7cff564b0cb0459a7c22903119f7a42947c32c1cc6a434a86f0e26aad00ca2b2aff6ba381",
              ) as PubkeyBytes,
            },
          },
          address: "0x88F3b5659075D0E06bB1004BE7b1a7E66F452284" as Address,
          chainName: "Ganache",
        },
      ],
    ]);

    store.dispatch(setIdentities(newState));

    const identitiesState = store.getState().identities;
    expect(identitiesState).toEqual(newState);
  });
});
