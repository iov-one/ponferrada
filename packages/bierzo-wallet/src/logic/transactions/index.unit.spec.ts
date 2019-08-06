import { BlockchainConnection, Identity } from "@iov/bcp";

import { aNewStore } from "../../store";
import { ProcessedSendTransaction } from "../../store/notifications";
import * as transactionActions from "../../store/notifications/actions";
import { createPubkeys } from "../../utils/test/pubkeys";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { sleep } from "../../utils/timer";
import * as tokens from "../../utils/tokens";
import { disconnect } from "../connection";
import { drinkFaucetIfNeeded } from "../faucet";
import { subscribeTransaction, unsubscribeTransactions } from "../transactions";

withChainsDescribe("Logic :: transaction subscriptions", () => {
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

  it("fires transaction callback when account does something", async () => {
    const txsSpy = jest.spyOn(transactionActions, "addTransaction") as jest.SpyInstance<
      transactionActions.AddTransactionActionType,
      [ProcessedSendTransaction]
    >;

    const store = aNewStore();
    const keys = await createPubkeys();

    await subscribeTransaction(keys, store.dispatch);

    // Trigger incoming SendTransactions
    await drinkFaucetIfNeeded(keys);

    // Wait for events to be processed
    await sleep(1000);

    // Got one incoming transaction for BASH, CASH, ETH
    expect(txsSpy).toHaveBeenCalledTimes(3);
    const transactions = txsSpy.mock.calls.map(call => call[0]);
    expect(new Set(transactions.map(tx => tx.original.amount.tokenTicker))).toEqual(
      new Set(["BASH", "CASH", "ETH"]),
    );

    unsubscribeTransactions();
  }, 30000);
});
