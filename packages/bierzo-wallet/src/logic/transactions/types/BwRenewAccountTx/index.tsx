import { RenewAccountTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwRenewAccountParser extends BwParser<RenewAccountTx> {
  public graphicalRepresentation(tx: ProcessedTx<RenewAccountTx>): JSX.Element {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<RenewAccountTx>, lastOne: boolean): JSX.Element {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
