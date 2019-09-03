import { Address, BlockchainConnection, ConfirmedTransaction, SendTransaction } from "@iov/bcp";
import * as React from "react";

import { CsvRow } from "../../../csvBuilder";
import { BwParser, ProcessedTx } from "../../types/BwParser";
import UnkownTransactionHeader from "./ui/UnknownTxHeader";
import UnkownTransactionRow from "./ui/UnknownTxRow";

export interface BwUnknownProps extends ProcessedTx {}

export class BwUnkownParser extends BwParser<BwUnknownProps> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<SendTransaction>,
    _currentAddress: Address,
  ): Promise<BwUnknownProps> {
    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    return {
      time,
      id: trans.transactionId,
      original: trans.transaction,
    };
  }

  public graphicalRepresentation(tx: BwUnknownProps): JSX.Element {
    return <UnkownTransactionRow key={tx.id} tx={tx} />;
  }

  public csvRepresentation(tx: BwUnknownProps): CsvRow {
    const { original } = tx;

    const fee = original.fee && original.fee.tokens ? original.fee.tokens : undefined;

    return {
      id: tx.id,
      recepient: "N/A",
      sender: "N/A",
      quantity: "",
      fractionalDigits: "",
      tokenTicker: "",
      feeQuantity: fee ? fee.quantity : "",
      feeFractionalDigits: fee ? fee.fractionalDigits.toString() : "",
      feeTokenTicker: fee ? fee.tokenTicker : "",
      time: tx.time.toISOString(),
      note: `Unknown transaction. Kind: ${original.kind}`,
    };
  }

  public headerRepresentation(tx: BwUnknownProps, lastOne: boolean): JSX.Element {
    return <UnkownTransactionHeader key={tx.id} tx={tx} lastOne={lastOne} />;
  }
}
