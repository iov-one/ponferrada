import { RegisterDomainTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../../types/BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwRegisterDomainParser extends BwParser<RegisterDomainTx> {
  public graphicalRepresentation(tx: ProcessedTx<RegisterDomainTx>): React.ReactElement {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<RegisterDomainTx>, lastOne: boolean): React.ReactElement {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
