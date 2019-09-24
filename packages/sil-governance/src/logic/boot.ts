import { Address, Identity } from "@iov/bcp";
import { Governor } from "@iov/bns-governance";
import { Encoding } from "@iov/encoding";
import { Dispatch } from "redux";
import { Stream } from "xstream";

import { getConfig } from "../config";
import { setBlockchainAction } from "../store/blockchain";
import { setExtensionStateAction } from "../store/extension";
import { refreshProposalsAction } from "../store/proposals";
import { getBnsConnection } from "./connection";

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
  dispatch(refreshProposalsAction());

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
}
