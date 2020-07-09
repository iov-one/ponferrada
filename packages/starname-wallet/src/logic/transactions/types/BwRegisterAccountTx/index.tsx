import { RegisterAccountTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../../types/BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwRegisterAccountParser extends BwParser<RegisterAccountTx> {
  public graphicalRepresentation(tx: ProcessedTx<RegisterAccountTx>): React.ReactElement {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<RegisterAccountTx>, lastOne: boolean): React.ReactElement {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
