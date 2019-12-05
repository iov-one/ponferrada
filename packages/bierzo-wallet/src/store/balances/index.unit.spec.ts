import { Address, Algorithm, ChainId, PubkeyBytes } from "@iov/bcp";
import { Encoding } from "@iov/encoding";

import { disconnect } from "../../logic/connection";
import { aNewStore } from "../../store";
import { establishAllConnections } from "../../utils/test/connections";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { ExtendedIdentity, IdentitiesState, setIdentities } from "../identities";
import { getBalances, setBalancesAction } from "./actions";

withChainsDescribe("Tokens reducer", () => {
  beforeAll(async () => {
    await establishAllConnections();
  });
  afterAll(() => disconnect());

  it("has correct initial state", async () => {
    const store = aNewStore();
    const balances = store.getState().balances;
    expect(balances).toEqual({});
  });

  it("dispatches correctly addBalances action", async () => {
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

    const tokens = await getBalances(
      Array.from(store.getState().identities.values()).map(ext => ext.identity),
    );
    store.dispatch(setBalancesAction(tokens));

    const balances = store.getState().balances;
    expect(balances.ETH).toBeDefined();
    expect(balances.ETH.fractionalDigits).toEqual(18);
    expect(balances.ETH.quantity).toMatch(/^[0-9]{10,22}$/);
    expect(balances.ETH.tokenTicker).toEqual("ETH");
  });
});
