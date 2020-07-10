import { DeleteAccountTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwDeleteAccountParser extends BwParser<DeleteAccountTx> {
  public graphicalRepresentation(tx: ProcessedTx<DeleteAccountTx>): React.ReactElement {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<DeleteAccountTx>, lastOne: boolean): React.ReactElement {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
