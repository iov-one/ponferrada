import { DeleteAllAccountsTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwDeleteAllAccountsParser extends BwParser<DeleteAllAccountsTx> {
  public graphicalRepresentation(tx: ProcessedTx<DeleteAllAccountsTx>): JSX.Element {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<DeleteAllAccountsTx>, lastOne: boolean): JSX.Element {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
