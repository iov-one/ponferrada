import { Address, Identity } from "@iov/bcp";
import { Governor } from "@iov/bns-governance";
import { Encoding } from "@iov/encoding";
import { Dispatch, Store } from "redux";
import { Stream } from "xstream";

import { getConfig } from "../config";
import { setBlockchainAction } from "../store/blockchain";
import { setExtensionStateAction } from "../store/extension";
import { getProposals, replaceProposalsAction } from "../store/proposals";
import { RootState } from "../store/reducers";
import { getBnsConnection } from "./connection";

export async function bootApplication(
  store: Store,
  dispatch: Dispatch,
  identities: readonly Identity[],
): Promise<void> {
  const config = await getConfig();

  const escrowHex = config.bnsChain.guaranteeFundEscrowId;
  if (!escrowHex) throw Error("No Escrow ID provided. This is a bug.");
  const guaranteeFundEscrowId = Encoding.fromHex(escrowHex);

  const rewardFundAddress = config.bnsChain.rewardFundAddress;
  if (!rewardFundAddress) throw Error("No Reward Address provided. This is a bug.");

  const connection = await getBnsConnection();
  const identity = identities[0];

  const governor = new Governor({
    connection,
    identity,
    guaranteeFundEscrowId,
    rewardFundAddress: rewardFundAddress as Address,
  });

  dispatch(setExtensionStateAction(true, true, governor));

  // Subscriptions

  const current = Stream.fromPromise(connection.height().then(height => connection.getBlockHeader(height)));
  const updates = connection.watchBlockHeaders();
  const blockHeadersSubscription = Stream.merge(current, updates).subscribe({
    next: header => {
      dispatch(
        setBlockchainAction({
          connection: connection,
          subscriptions: [blockHeadersSubscription],
          lastBlockheight: header.height,
          lastBlockTime: header.time,
        }),
      );
    },
  });

  const refreshProposals = async (): Promise<void> => {
    const proposals = await getProposals(governor);
    dispatch(replaceProposalsAction(proposals));
    console.count("Updated proposals");
  };

  let lastNetworkRequest = new Date();
  const timeToPoll = 20 * 1000;

  setInterval(async () => {
    const isUpdateRequired = (store.getState() as RootState).proposalsState.updateRequired;
    const timeToPollHasPassed = new Date().getTime() - lastNetworkRequest.getTime() > timeToPoll;

    if (isUpdateRequired || timeToPollHasPassed) {
      await refreshProposals();
      lastNetworkRequest = new Date();
    }
  }, 500);
}
