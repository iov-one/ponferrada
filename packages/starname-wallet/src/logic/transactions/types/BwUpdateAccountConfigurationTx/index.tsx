import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwUpdateAccountConfigurationParser extends BwParser<any> {
  public graphicalRepresentation(tx: ProcessedTx<any>): React.ReactElement {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<any>, lastOne: boolean): React.ReactElement {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
