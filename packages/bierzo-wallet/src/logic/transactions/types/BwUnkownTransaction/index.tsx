import { Address, BlockchainConnection, ConfirmedTransaction, UnsignedTransaction } from "@iov/bcp";
import * as React from "react";

import { BwParser, ProcessedTx } from "../../types/BwParser";
import UnkownTransactionHeader from "./ui/UnknownTxHeader";
import UnkownTransactionRow from "./ui/UnknownTxRow";

export class BwUnkownParser extends BwParser<UnsignedTransaction> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<UnsignedTransaction>,
    _currentAddress: Address,
  ): Promise<ProcessedTx<UnsignedTransaction>> {
    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    return {
      time,
      id: trans.transactionId,
      original: trans.transaction,
    };
  }

  public graphicalRepresentation(tx: ProcessedTx<UnsignedTransaction>): JSX.Element {
    return <UnkownTransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<UnsignedTransaction>, lastOne: boolean): JSX.Element {
    return <UnkownTransactionHeader key={tx.id} tx={tx} lastOne={lastOne} />;
  }
}
