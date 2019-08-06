import { BlockchainConnection, Identity } from "@iov/bcp";

import { aNewStore } from "../store";
import * as balanceActions from "../store/balances/actions";
import { createPubkeys } from "../utils/test/pubkeys";
import { withChainsDescribe } from "../utils/test/testExecutor";
import { sleep } from "../utils/timer";
import * as tokens from "../utils/tokens";
import { subscribeBalance, unsubscribeBalances } from "./balances";
import { disconnect } from "./connection";
import { drinkFaucetIfNeeded } from "./faucet";

withChainsDescribe("Logic :: balance subscriptions", () => {
  beforeAll(() => {
    jest
      .spyOn(tokens, "filterExistingTokens")
      .mockImplementation(
        (_connection: BlockchainConnection, _identity: Identity, tokensByChainId: readonly string[]) =>
          Promise.resolve(tokensByChainId),
      );
  });

  afterAll(() => {
    jest.spyOn(tokens, "filterExistingTokens").mockReset();
    disconnect();
  });

  it("fires subscription callback when account balance changes", async () => {
    const balanceSpy = jest.spyOn(balanceActions, "addBalancesAction");

    const store = aNewStore();
    const keys = await createPubkeys();

    await subscribeBalance(keys, store.dispatch);

    // Trick for forcing account to receive balance events updates
    await drinkFaucetIfNeeded(keys);

    // Wait for events to be processed
    await sleep(1000);

    // Got one update per incoming transaction for BASH, CASH, ETH
    expect(balanceSpy).toHaveBeenCalledTimes(3);

    unsubscribeBalances();
  }, 35000);
});
