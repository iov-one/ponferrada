import { Address, BlockchainConnection, ConfirmedTransaction, LightTransaction } from "@iov/bcp";
import * as React from "react";

import { CsvRow } from "../../../csvBuilder";
import { BwParser, ProcessedTx } from "../../types/BwParser";
import UnkownTransactionHeader from "./ui/UnknownTxHeader";
import UnkownTransactionRow from "./ui/UnknownTxRow";

export class BwUnkownParser extends BwParser<LightTransaction> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<LightTransaction>,
    _currentAddress: Address,
  ): Promise<ProcessedTx<LightTransaction>> {
    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    return {
      time,
      id: trans.transactionId,
      original: trans.transaction,
    };
  }

  public graphicalRepresentation(tx: ProcessedTx<LightTransaction>): JSX.Element {
    return <UnkownTransactionRow key={tx.id} tx={tx} />;
  }

  public csvRepresentation(tx: ProcessedTx<LightTransaction>): CsvRow {
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

  public headerRepresentation(tx: ProcessedTx<LightTransaction>, lastOne: boolean): JSX.Element {
    return <UnkownTransactionHeader key={tx.id} tx={tx} lastOne={lastOne} />;
  }
}
