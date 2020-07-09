import { Address, Algorithm, ChainId, Identity, PubkeyBytes } from "@iov/bcp";
import { Encoding } from "@iov/encoding";

import { disconnect } from "../../logic/connection";
import { aNewStore } from "../../store";
import { establishAllConnections } from "../../utils/test/connections";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { addUsernamesAction, getUsernames } from "./actions";
import { BwUsername } from "./reducer";

withChainsDescribe("Usernames reducer", () => {
  beforeAll(async () => {
    await establishAllConnections();
  });
  afterAll(() => disconnect());

  it("has correct initial state", async () => {
    const store = aNewStore();
    const usernames = store.getState().usernames;
    expect(usernames).toEqual([]);
  });

  it("returns empty when no identities passed to getUsernames function", async () => {
    const usernames = await getUsernames([]);
    expect(usernames).toEqual([]);
  });

  it("returns empty when no bns identity key is passed to getUsernames function", async () => {
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

    const usernames = await getUsernames(identities);
    expect(usernames).toEqual([]);
  });

  describe("usernamesReducer", () => {
    it("can add usernames", () => {
      const usernamesToAdd: BwUsername[] = [
        {
          username: "foobar",
          addresses: [],
        },
      ];

      const store = aNewStore();
      expect(store.getState().usernames).toEqual([]);
      store.dispatch(addUsernamesAction(usernamesToAdd));
      expect(store.getState().usernames).toEqual(usernamesToAdd);
    });

    it("overrides existing entries", () => {
      const usernamesToAdd1: BwUsername[] = [
        {
          username: "foobar",
          addresses: [],
        },
      ];
      const usernamesToAdd2: BwUsername[] = [
        {
          username: "foobar",
          addresses: [
            {
              address: "aabbccdd" as Address,
              chainId: "some-chain" as ChainId,
            },
          ],
        },
      ];

      const store = aNewStore();
      store.dispatch(addUsernamesAction(usernamesToAdd1));
      store.dispatch(addUsernamesAction(usernamesToAdd2));
      expect(store.getState().usernames).toEqual(usernamesToAdd2);
    });

    it("overrides keeps existing entries alive", () => {
      const usernamesToAdd1: BwUsername[] = [
        {
          username: "foobar1",
          addresses: [],
        },
      ];
      const usernamesToAdd2: BwUsername[] = [
        {
          username: "foobar2",
          addresses: [],
        },
      ];

      const store = aNewStore();
      store.dispatch(addUsernamesAction(usernamesToAdd1));
      store.dispatch(addUsernamesAction(usernamesToAdd2));
      expect(store.getState().usernames).toEqual([...usernamesToAdd1, ...usernamesToAdd2]);
    });
  });
});
