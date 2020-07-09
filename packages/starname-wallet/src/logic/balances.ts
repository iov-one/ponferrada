import { Dispatch } from "redux";
import { Subscription } from "xstream";

let balanceSubscriptions: Subscription[] = [];

export async function subscribeBalance(identities: readonly any[], dispatch: Dispatch): Promise<void> {
  /*const config = await getConfig();
  const chains = config.chains;
  const connections = getActiveConnections();

  for (const connection of connections) {
    const chain = chains.find(chain => chain.chainSpec.chainId === connection.chainId);
    if (!chain) {
      throw new Error(`Chain for ${connection.chainId} not found.`);
    }
    const identity = identities.find(identity => identity.chainId === connection.chainId);
    if (!identity) {
      continue;
    }

    const codec = getCodec(chain.chainSpec, config);
    const address = codec.identityToAddress(identity);

    // subscribe to balance changes via
    const subscription = connection.watchAccount({ address }).subscribe({
      next: async account => {
        if (account) {
          const balances = await getBalances(identities);
          dispatch(setBalancesAction(balances));
        }
      },
    });
    balanceSubscriptions.push(subscription);
  }

  // subscribe to transactions
  // const transactionsStream = connection.liveTx({ sentFromOrTo: address });*/
}

export function unsubscribeBalances(): void {
  balanceSubscriptions.forEach(subs => subs.unsubscribe());
  balanceSubscriptions = [];
}
