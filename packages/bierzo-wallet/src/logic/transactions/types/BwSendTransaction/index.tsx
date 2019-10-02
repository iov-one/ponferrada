import { Address, BlockchainConnection, ConfirmedTransaction, SendTransaction } from "@iov/bcp";
import * as React from "react";

import { ProcessedSendTransaction } from "../../../../store/notifications";
import { CsvRow } from "../../../csvBuilder";
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
  ): JSX.Element {
    return <SendTransactionRow key={sendTx.id} sendTx={sendTx} userAddresses={userAddresses} />;
  }

  public csvRepresentation(tx: ProcessedSendTransaction): CsvRow {
    const { original } = tx;

    const fee = original.fee && original.fee.tokens ? original.fee.tokens : undefined;

    return {
      id: tx.id,
      recepient: original.recipient,
      sender: original.sender,
      quantity: original.amount.quantity,
      fractionalDigits: original.amount.fractionalDigits.toString(),
      tokenTicker: original.amount.tokenTicker,
      feeQuantity: fee ? fee.quantity : "",
      feeFractionalDigits: fee ? fee.fractionalDigits.toString() : "",
      feeTokenTicker: fee ? fee.tokenTicker : "",
      time: tx.time.toISOString(),
      note: original.memo ? original.memo : "",
    };
  }

  public headerRepresentation(tx: ProcessedSendTransaction, lastOne: boolean): JSX.Element {
    return <SendTransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
