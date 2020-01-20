import { Address, BlockchainConnection, ConfirmedTransaction } from "@iov/bcp";
import { UpdateTargetsOfUsernameTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwUpdateUsernameTargetParser extends BwParser<UpdateTargetsOfUsernameTx> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<UpdateTargetsOfUsernameTx>,
    _: Address,
  ): Promise<ProcessedTx<UpdateTargetsOfUsernameTx>> {
    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    return {
      id: trans.transactionId,
      time,
      original: trans.transaction,
    };
  }

  public graphicalRepresentation(tx: ProcessedTx<UpdateTargetsOfUsernameTx>): JSX.Element {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<UpdateTargetsOfUsernameTx>, lastOne: boolean): JSX.Element {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
