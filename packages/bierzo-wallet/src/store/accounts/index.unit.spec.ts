import { Address, Algorithm, ChainId, Identity, PubkeyBytes } from "@iov/bcp";
import { Encoding } from "@iov/encoding";

import { aNewStore } from "..";
import { disconnect } from "../../logic/connection";
import { establishAllConnections } from "../../utils/test/connections";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { addAccountsAction, getAccounts } from "./actions";
import { BwAccount } from "./reducer";

const defaultDate = new Date(1000000000000);

withChainsDescribe("Accounts reducer", () => {
  beforeAll(async () => {
    await establishAllConnections();
  });
  afterAll(() => disconnect());

  it("has correct initial state", async () => {
    const store = aNewStore();
    const accounts = store.getState().accounts;
    expect(accounts).toEqual([]);
  });

  it("returns empty when no identities passed to getAccounts function", async () => {
    const accounts = await getAccounts([]);
    expect(accounts).toEqual([]);
  });

  it("returns empty when no bns identity key is passed to getAccounts function", async () => {
    const identities: Identity[] = [
      {
        chainId: "ethereum-eip155-5777" as ChainId,
        pubkey: {
          algo: Algorithm.Secp256k1,
          data: Encoding.fromHex(
            "04965fb72aad79318cd8c8c975cf18fa8bcac0c091605d10e89cd5a9f7cff564b0cb0459a7c22903119f7a42947c32c1cc6a434a86f0e26aad00ca2b2aff6ba381",
          ) as PubkeyBytes,
        },
      },
    ];

    const accounts = await getAccounts(identities);
    expect(accounts).toEqual([]);
  });

  describe("accountsReducer", () => {
    it("can add accounts", () => {
      const accountsToAdd: BwAccount[] = [
        {
          name: "foobar",
          domain: "fizzbuzz",
          expiryDate: defaultDate,
          owner: "aabbccdd" as Address,
          addresses: [],
        },
      ];

      const store = aNewStore();
      expect(store.getState().accounts).toEqual([]);
      store.dispatch(addAccountsAction(accountsToAdd));
      expect(store.getState().accounts).toEqual(accountsToAdd);
    });

    it("overrides existing entries", () => {
      const accountsToAdd1: BwAccount[] = [
        {
          name: "foobar",
          domain: "fizzbuzz",
          expiryDate: defaultDate,
          owner: "aabbccdd" as Address,
          addresses: [],
        },
      ];
      const accounts: BwAccount[] = [
        {
          name: "foobar",
          domain: "fizzbuzz",
          expiryDate: defaultDate,
          owner: "aabbccdd" as Address,
          addresses: [
            {
              address: "aabbccdd" as Address,
              chainId: "some-chain" as ChainId,
            },
          ],
        },
      ];

      const store = aNewStore();
      store.dispatch(addAccountsAction(accountsToAdd1));
      store.dispatch(addAccountsAction(accounts));
      expect(store.getState().accounts).toEqual(accounts);
    });

    it("overrides keeps existing entries alive", () => {
      const accountsToAdd1: BwAccount[] = [
        {
          name: "foobar1",
          domain: "fizzbuzz1",
          expiryDate: defaultDate,
          owner: "aabbccdd" as Address,
          addresses: [],
        },
      ];
      const accountsToAdd2: BwAccount[] = [
        {
          name: "foobar2",
          domain: "fizzbuzz2",
          expiryDate: defaultDate,
          owner: "aabbccdd" as Address,
          addresses: [],
        },
      ];

      const store = aNewStore();
      store.dispatch(addAccountsAction(accountsToAdd1));
      store.dispatch(addAccountsAction(accountsToAdd2));
      expect(store.getState().accounts).toEqual([...accountsToAdd1, ...accountsToAdd2]);
    });
  });
});
