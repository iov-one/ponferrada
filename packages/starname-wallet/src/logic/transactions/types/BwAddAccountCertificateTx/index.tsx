import { AddAccountCertificateTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwAddAccountCertificateParser extends BwParser<AddAccountCertificateTx> {
  public graphicalRepresentation(tx: ProcessedTx<AddAccountCertificateTx>): React.ReactElement {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(
    tx: ProcessedTx<AddAccountCertificateTx>,
    lastOne: boolean,
  ): React.ReactElement {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
