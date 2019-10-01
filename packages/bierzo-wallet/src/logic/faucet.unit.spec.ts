import { getBalances } from "../store/balances";
import { establishAllConnections } from "../utils/test/connections";
import { createIdentities } from "../utils/test/identities";
import { withChainsDescribe } from "../utils/test/testExecutor";
import { disconnect } from "./connection";
import { drinkFaucetIfNeeded } from "./faucet";

withChainsDescribe("Logic :: faucet", () => {
  beforeAll(async () => {
    await establishAllConnections();
  });
  afterAll(() => disconnect());

  it("works", async () => {
    // generate identities
    const identities = await createIdentities();
    // check their balance are 0
    const initialBalances = await getBalances(identities);
    expect(initialBalances).toEqual({});
    // drink faucet
    await drinkFaucetIfNeeded(identities);
    // check their balances
    const balances = await getBalances(identities);
    expect(balances).toEqual({
      BASH: {
        fractionalDigits: 9,
        quantity: "10000000000",
        tokenTicker: "BASH",
      },
      CASH: {
        fractionalDigits: 9,
        quantity: "10000000000",
        tokenTicker: "CASH",
      },
      ETH: {
        fractionalDigits: 18,
        quantity: "10000000000000000000",
        tokenTicker: "ETH",
      },
    });
  }, 45000);

  it("does not drink from faucet if tokens are already available", async () => {
    // generate identities
    const identities = await createIdentities();
    // drink faucet twice
    await drinkFaucetIfNeeded(identities);
    await drinkFaucetIfNeeded(identities);
    // check their balances
    const balances = await getBalances(identities);
    expect(balances).toEqual({
      BASH: {
        fractionalDigits: 9,
        quantity: "10000000000",
        tokenTicker: "BASH",
      },
      CASH: {
        fractionalDigits: 9,
        quantity: "10000000000",
        tokenTicker: "CASH",
      },
      ETH: {
        fractionalDigits: 18,
        quantity: "10000000000000000000",
        tokenTicker: "ETH",
      },
    });
  }, 45000);
});
