import { Address, BlockchainConnection, ConfirmedTransaction, SendTransaction } from "@iov/bcp";
import * as React from "react";

import { ProcessedSendTransaction } from "../../../../store/notifications";
import { BwParser } from "../../types/BwParser";
import SendTransactionHeader from "./ui/SendTxHeader";
import SendTransactionRow from "./ui/SendTxRow";

export class BwSendParser extends BwParser<SendTransaction> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<SendTransaction>,
    currentUserAddress: Address,
  ): Promise<ProcessedSendTransaction> {
    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    return {
      id: trans.transactionId,
      time,
      original: trans.transaction,
      incoming: trans.transaction.recipient === currentUserAddress,
      outgoing: trans.transaction.sender === currentUserAddress,
    };
  }

  public graphicalRepresentation(
    sendTx: ProcessedSendTransaction,
    userAddresses: readonly Address[],
  ): React.ReactElement {
    return <SendTransactionRow key={sendTx.id} sendTx={sendTx} userAddresses={userAddresses} />;
  }

  public headerRepresentation(tx: ProcessedSendTransaction, lastOne: boolean): React.ReactElement {
    return <SendTransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
