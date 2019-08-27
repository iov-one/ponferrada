import { Address, BlockchainConnection, ConfirmedTransaction, SendTransaction } from "@iov/bcp";
import * as React from "react";

import { ProcessedSendTransaction } from "../../../../store/notifications";
import { BwParser } from "../../types/BwParser";
import SendTransactionHeader from "./ui/SendTxHeader";
import SendTransactionRow from "./ui/SendTxRow";

export class BwSendParser extends BwParser<ProcessedSendTransaction> {
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

  public graphicalRepresentation(sendTx: ProcessedSendTransaction): JSX.Element {
    return <SendTransactionRow key={sendTx.id} sendTx={sendTx} />;
  }

  public csvRepresentation(tx: ProcessedSendTransaction): string {
    const { original } = tx;
    const parties = [`"${tx.id}"`, `"${original.recipient}"`, `"${original.sender}"`];
    const payment = [
      `"${original.amount.quantity}"`,
      `"${original.amount.fractionalDigits}"`,
      `"${original.amount.tokenTicker}"`,
    ];
    let fee = [`""`, `""`, `""`];
    if (original.fee && original.fee.tokens) {
      fee = [
        `"${original.fee.tokens.quantity}"`,
        `"${original.fee.tokens.fractionalDigits}"`,
        `"${original.fee.tokens.tokenTicker}"`,
      ];
    }
    const date = [`"${tx.time.toISOString()}"`];
    const status = [`"${original.memo}"`];

    const txRow = [...parties, ...payment, ...fee, ...date, ...status];

    return txRow.join(";");
  }

  public headerRepresentation(tx: ProcessedSendTransaction, lastOne: boolean): JSX.Element {
    return <SendTransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
