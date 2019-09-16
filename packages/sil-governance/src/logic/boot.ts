import { Address, Identity } from "@iov/bcp";
import { Governor } from "@iov/bns-governance";
import { Encoding } from "@iov/encoding";
import { Dispatch } from "redux";
import { Subscription } from "xstream";

import { getConfig } from "../config";
import { setBlockchainAction } from "../store/blockchain";
import { setExtensionStateAction } from "../store/extension";
import { getProposals, replaceProposalsAction } from "../store/proposals";
import { getBnsConnection } from "./connection";

let blockHeadersSubscription: Subscription | undefined;

export async function bootApplication(dispatch: Dispatch, identities: readonly Identity[]): Promise<void> {
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

  const proposals = await getProposals(governor);
  dispatch(replaceProposalsAction(proposals));

  // Subscriptions

  blockHeadersSubscription = connection.watchBlockHeaders().subscribe({
    next: header => {
      dispatch(
        setBlockchainAction({
          lastBlockheight: header.height,
          lastBlockTime: header.time,
        }),
      );
    },
  });
}

export async function shutdownApplication(): Promise<void> {
  if (blockHeadersSubscription) {
    blockHeadersSubscription.unsubscribe();
    blockHeadersSubscription = undefined;
  }
}
