import { Address, BlockchainConnection, ConfirmedTransaction, LightTransaction } from "@iov/bcp";
import * as React from "react";

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

  public headerRepresentation(tx: ProcessedTx<LightTransaction>, lastOne: boolean): JSX.Element {
    return <UnkownTransactionHeader key={tx.id} tx={tx} lastOne={lastOne} />;
  }
}
