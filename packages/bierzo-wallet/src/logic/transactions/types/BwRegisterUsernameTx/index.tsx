import { Address, BlockchainConnection, ConfirmedTransaction } from "@iov/bcp";
import { RegisterUsernameTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../../types/BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwRegisterUsernameParser extends BwParser<RegisterUsernameTx> {
  public async parse(
    conn: BlockchainConnection,
    trans: ConfirmedTransaction<RegisterUsernameTx>,
    _: Address,
  ): Promise<ProcessedTx<RegisterUsernameTx>> {
    const header = await conn.getBlockHeader(trans.height);
    const time = header.time;

    return {
      id: trans.transactionId,
      time,
      original: trans.transaction,
    };
  }

  public graphicalRepresentation(sendTx: ProcessedTx<RegisterUsernameTx>): JSX.Element {
    return <TransactionRow key={sendTx.id} sendTx={sendTx} />;
  }

  public csvRepresentation(tx: ProcessedTx<RegisterUsernameTx>): string {
    const { original } = tx;
    const parties = [`"${tx.id}"`, `"Personalized address registration"`, `"N/A"`];
    const payment = ['"N/A"', '"N/A"', '"N/A"'];
    const date = [`"${tx.time.toISOString()}"`];
    const status = [`"${original.username}"`];

    const txRow = [...parties, ...payment, ...date, ...status];

    return txRow.join(";");
  }

  public headerRepresentation(tx: ProcessedTx<RegisterUsernameTx>, lastOne: boolean): JSX.Element {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
